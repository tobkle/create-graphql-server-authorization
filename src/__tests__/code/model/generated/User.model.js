/* eslint-disable prettier */
import DataLoader from 'dataloader';
import {
  findByIds,
  getLogFilename,
  logger
} from 'create-graphql-server-authorization';
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;
const log = logger(getLogFilename());

export default class User {
  constructor(context) {
    this.context = context;
    this.collection = context.db.collection('user');
    this.pubsub = context.pubsub;
    this.authorizedLoader = new DataLoader(ids =>
      findByIds(this.collection, ids)
    );
  }

  async findOneById(id) {
    if (!this.authorizedLoader) {
      return null;
    }
    return await this.authorizedLoader.load(id);
  }

  find({ lastCreatedAt = 0, limit = 10, baseQuery = {} }) {
    const finalQuery = { ...baseQuery, createdAt: { $gt: lastCreatedAt } };
    return this.collection
      .find(finalQuery)
      .sort({ createdAt: 1 })
      .limit(limit)
      .toArray();
  }

  tweets(user, { minLikes, lastCreatedAt = 0, limit = 10 }, me, resolver) {
    const baseQuery = { authorId: user._id };
    return this.context.Tweet.find(
      { baseQuery, minLikes, lastCreatedAt, limit },
      me,
      resolver
    );
  }

  liked(user, { lastCreatedAt = 0, limit = 10 }, me, resolver) {
    const baseQuery = { _id: { $in: user.likedIds || [] } };
    return this.context.Tweet.find(
      { baseQuery, lastCreatedAt, limit },
      me,
      resolver
    );
  }

  following(user, { lastCreatedAt = 0, limit = 10 }, me, resolver) {
    const baseQuery = { _id: { $in: user.followingIds || [] } };
    return this.context.User.find(
      { baseQuery, lastCreatedAt, limit },
      me,
      resolver
    );
  }

  followers(user, { lastCreatedAt = 0, limit = 10 }, me, resolver) {
    const baseQuery = { followingIds: user._id };
    return this.context.User.find(
      { baseQuery, lastCreatedAt, limit },
      me,
      resolver
    );
  }

  async insert(doc) {
    // We don't want to store passwords in plaintext
    const { password, ...rest } = doc;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const docToInsert = Object.assign({}, rest, {
      hash,
      createdAt: Date.now(),
      updatedAt: Date.now()
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

  async updateById(id, doc) {
    const docToUpdate = {
      $set: Object.assign({}, doc, {
        updatedAt: Date.now()
      })
    };
    const baseQuery = { _id: id };
    const finalQuery = { ...baseQuery };
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

  async removeById(id) {
    const baseQuery = { _id: id };
    const finalQuery = { ...baseQuery };
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
