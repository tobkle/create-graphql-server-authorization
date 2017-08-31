import DataLoader from 'dataloader';
import {
  findByIds,
  queryForRoles,
  getLogFilename,
  logger,
  authlog,
  checkAuthDoc,
  protectFields
} from 'create-graphql-server-authorization';
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;
const log = logger(getLogFilename());

export default class User {
  constructor(context) {
    this.context = context;
    this.collection = context.db.collection('user');
    this.pubsub = context.pubsub;
    this.authRole = User.authRole;
    const { me } = context;
    const authQuery = queryForRoles(
      me,
      ['admin'],
      ['_id'],
      { User },
      authlog('user findOneById', 'readOne', me)
    );
    this.authorizedLoader = new DataLoader(ids =>
      findByIds(this.collection, ids, authQuery)
    );
  }

  static authRole(user) {
    return user && user.role ? user.role : null;
  }

  async findOneById(id) {
    if (!this.authorizedLoader) {
      return null;
    }
    return await this.authorizedLoader.load(id);
  }

  find({ lastCreatedAt = 0, limit = 10, baseQuery = {} }, me, resolver) {
    const authQuery = queryForRoles(
      me,
      ['admin'],
      ['_id'],
      { User: this.context.User },
      authlog(resolver, 'readMany', me)
    );
    const finalQuery = {
      ...baseQuery,
      ...authQuery,
      createdAt: { $gt: lastCreatedAt }
    };
    return this.collection
      .find(finalQuery)
      .sort({ createdAt: 1 })
      .limit(limit)
      .toArray();
  }

  createdBy(user, me, resolver) {
    return this.context.User.findOneById(user.createdById, me, resolver);
  }

  updatedBy(user, me, resolver) {
    return this.context.User.findOneById(user.updatedById, me, resolver);
  }

  async insert(doc, me, resolver) {
    // We don't want to store passwords in plaintext
    const { password, ...rest } = doc;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    let docToInsert = Object.assign({}, rest, {
      hash,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdById: me && me._id ? me._id : 'unknown',
      updatedById: me && me._id ? me._id : 'unknown'
    });
    checkAuthDoc(
      docToInsert,
      me,
      ['admin'],
      ['_id'],
      { User: this.context.User },
      authlog(resolver, 'create', me)
    );
    docToInsert = protectFields(me, ['admin'], ['role'], docToInsert, {
      User: this.context.User
    });
    const id = (await this.collection.insertOne(docToInsert)).insertedId;
    if (!id) {
      throw new Error(`insert user not possible.`);
    }
    log.debug(`inserted user ${id}.`);
    const insertedDoc = this.findOneById(id);
    this.pubsub.publish('userInserted', insertedDoc);
    return insertedDoc;
  }

  async updateById(id, doc, me, resolver) {
    const docToUpdate = {
      $set: Object.assign({}, doc, {
        updatedAt: Date.now(),
        updatedById: me && me._id ? me._id : 'unknown'
      })
    };
    const baseQuery = { _id: id };
    const authQuery = queryForRoles(
      me,
      ['admin'],
      ['_id'],
      { User: this.context.User },
      authlog(resolver, 'update', me)
    );
    docToUpdate.$set = protectFields(
      me,
      ['admin'],
      ['role'],
      docToUpdate.$set,
      { User: this.context.User }
    );
    const finalQuery = { ...baseQuery, ...authQuery };
    const result = await this.collection.updateOne(finalQuery, docToUpdate);
    if (result.result.ok !== 1 || result.result.n !== 1) {
      throw new Error(`update user not possible for ${id}.`);
    }
    log.debug(`updated user ${id}.`);
    this.authorizedLoader.clear(id);
    const updatedDoc = this.findOneById(id);
    this.pubsub.publish('userUpdated', updatedDoc);
    return updatedDoc;
  }

  async removeById(id, me, resolver) {
    const baseQuery = { _id: id };
    const authQuery = queryForRoles(
      me,
      ['admin'],
      ['_id'],
      { User: this.context.User },
      authlog(resolver, 'delete', me)
    );
    const finalQuery = { ...baseQuery, ...authQuery };
    const result = await this.collection.remove(finalQuery);
    if (result.result.ok !== 1 || result.result.n !== 1) {
      throw new Error(`remove user not possible for ${id}.`);
    }
    log.debug(`removed user ${id}.`);
    this.authorizedLoader.clear(id);
    this.pubsub.publish('userRemoved', id);
    return result;
  }
}
