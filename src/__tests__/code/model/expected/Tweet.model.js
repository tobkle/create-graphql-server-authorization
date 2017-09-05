/* eslint-disable prettier */
import DataLoader from 'dataloader';

export default class Tweet {
  constructor(context) {
    this.context = context;
    this.collection = context.db.collection('tweet');
    this.pubsub = context.pubsub;
    this.loader = new DataLoader(ids =>
      this.context.findByIds(this.collection, ids)
    );
  }

  async findOneById(id) {
    if (!this.loader) {
      return null;
    }
    return await this.loader.load(id);
  }

  find({ lastCreatedAt = 0, limit = 10, baseQuery = {} }) {
    const finalQuery = { ...baseQuery, createdAt: { $gt: lastCreatedAt } };
    return this.collection
      .find(finalQuery)
      .sort({ createdAt: 1 })
      .limit(limit)
      .toArray();
  }

  author(tweet, me, resolver) {
    return this.context.User.findOneById(
      tweet.authorId,
      me,
      resolver
    );
  }

  coauthors(tweet, { lastCreatedAt = 0, limit = 10 }, me, resolver) {
    const baseQuery = { _id: { $in: tweet.coauthorsIds || [] } };
    return this.context.User.find(
      { baseQuery, lastCreatedAt, limit },
      me,
      resolver
    );
  }

  likers(tweet, { lastCreatedAt = 0, limit = 10 }, me, resolver) {
    const baseQuery = { likedIds: tweet._id };
    return this.context.User.find(
      { baseQuery, lastCreatedAt, limit },
      me,
      resolver
    );
  }

  async insert(doc) {
    const docToInsert = Object.assign({}, doc, {
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    const id = (await this.collection.insertOne(docToInsert)).insertedId;
    if (!id) {
      throw new Error(`insert tweet not possible.`);
    }
    this.context.log.debug(`inserted tweet ${id}.`);
    const insertedDoc = this.findOneById(id);
    this.pubsub.publish('tweetInserted', insertedDoc);
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
      throw new Error(`update tweet not possible for ${id}.`);
    }
    this.context.log.debug(`updated tweet ${id}.`);
    this.loader.clear(id);
    const updatedDoc = this.findOneById(id);
    this.pubsub.publish('tweetUpdated', updatedDoc);
    return updatedDoc;
  }

  async removeById(id) {
    const baseQuery = { _id: id };
    const finalQuery = { ...baseQuery };
    const result = await this.collection.remove(finalQuery);
    if (result.result.ok !== 1 || result.result.n !== 1) {
      throw new Error(`remove tweet not possible for ${id}.`);
    }
    this.context.log.debug(`removed tweet ${id}.`);
    this.loader.clear(id);
    this.pubsub.publish('tweetRemoved', id);
    return result;
  }
}
