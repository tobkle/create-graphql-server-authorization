import {
  queryForRoles,
  onAuthRegisterLoader,
  authlog,
  checkAuthDoc
} from 'create-graphql-server-authorization';

export default class Tweet {
  constructor(context) {
    this.context = context;
    this.collection = context.db.collection('tweet');
    this.pubsub = context.pubsub;
    const { me, User } = context;
    queryForRoles(
      me,
      ['admin', 'world'],
      ['authorId', 'coauthorsIds'],
      { User },
      onAuthRegisterLoader('tweet findOneById', 'readOne', me, this)
    );
  }

  async findOneById(id, me, resolver) {
    const log = authlog(resolver, 'readOne', me);
    if (!this.authorizedLoader) {
      log.error('not authorized');
      return null;
    }
    return await this.authorizedLoader.load(id);
  }

  find({ lastCreatedAt = 0, limit = 10, baseQuery = {} }, me, resolver) {
    const authQuery = queryForRoles(
      me,
      ['admin', 'world'],
      ['authorId', 'coauthorsIds'],
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

  createdBy(tweet, me, resolver) {
    return this.context.User.findOneById(tweet.createdById, me, resolver);
  }

  updatedBy(tweet, me, resolver) {
    return this.context.User.findOneById(tweet.updatedById, me, resolver);
  }

  async insert(doc, me, resolver) {
    const docToInsert = Object.assign({}, doc, {
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    checkAuthDoc(
      docToInsert,
      me,
      ['admin'],
      ['authorId'],
      { User: this.context.User },
      authlog(resolver, 'create', me)
    );
    const id = (await this.collection.insertOne(docToInsert)).insertedId;
    if (!id) {
      throw new Error(`insert tweet not possible.`);
    }
    this.log.debug(`inserted tweet ${id}.`);
    const insertedDoc = this.findOneById(id);
    this.pubsub.publish('tweetInserted', insertedDoc);
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
      ['authorId', 'coauthorsIds'],
      { User: this.context.User },
      authlog(resolver, 'update', me)
    );
    const finalQuery = { ...baseQuery, ...authQuery };
    const result = await this.collection.updateOne(finalQuery, docToUpdate);
    if (result.result.ok !== 1 || result.result.n !== 1) {
      throw new Error(`update tweet not possible for ${id}.`);
    }
    this.log.debug(`updated tweet ${id}.`);
    this.authorizedLoader.clear(id);
    const updatedDoc = this.findOneById(id);
    this.pubsub.publish('tweetUpdated', updatedDoc);
    return updatedDoc;
  }

  async removeById(id, me, resolver) {
    const baseQuery = { _id: id };
    const authQuery = queryForRoles(
      me,
      ['admin'],
      ['authorId'],
      { User: this.context.User },
      authlog(resolver, 'delete', me)
    );
    const finalQuery = { ...baseQuery, ...authQuery };
    const result = await this.collection.remove(finalQuery);
    if (result.result.ok !== 1 || result.result.n !== 1) {
      throw new Error(`remove tweet not possible for ${id}.`);
    }
    this.log.debug(`removed tweet ${id}.`);
    this.authorizedLoader.clear(id);
    this.pubsub.publish('tweetRemoved', id);
    return result;
  }
}
