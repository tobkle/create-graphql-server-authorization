import DataLoader from 'dataloader';
import { findByIds } from 'create-graphql-server-authorization';

export default class Tweet {
  constructor(context) {
    this.context = context;
    this.collection = context.db.collection('tweet');
    this.pubsub = context.pubsub;
    this.authorizedLoader = new DataLoader(ids =>
      findByIds(this.collection, ids)
    );
  }

  async findOneById(id) {
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

  async insert(doc) {
    const docToInsert = Object.assign({}, doc, {
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    const id = (await this.collection.insertOne(docToInsert)).insertedId;
    if (!id) {
      throw new Error(`insert tweet not possible.`);
    }
    this.log.debug(`inserted tweet ${id}.`);
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
    this.log.debug(`updated tweet ${id}.`);
    this.authorizedLoader.clear(id);
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
    this.log.debug(`removed tweet ${id}.`);
    this.authorizedLoader.clear(id);
    this.pubsub.publish('tweetRemoved', id);
    return result;
  }
}
