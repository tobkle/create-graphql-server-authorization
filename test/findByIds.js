import DataLoader from 'dataloader';
import mongodb from 'mongo-mock';
//import { ObjectId } from 'mongodb';
import ObjectId from 'bson-objectid';
import findByIds from "../dist/lib/findByIds";
import authlog from "../dist/lib/authlog";
import queryForRoles from "../dist/lib/queryForRoles";
import dummyUserContext from "./dummyUserContext";

const expect = require('chai').expect;
const assert = require('chai').assert;

// mocking User authRole, as it is not existing in this library
const User = dummyUserContext;

mongodb.max_delay = 0; // you can choose to NOT pretend to be async (default is 400ms)
const MongoClient = mongodb.MongoClient;
MongoClient.persist="log/mongo-mock.db.js"; // persist the data to disk
const url = 'mongodb://localhost:27017/myproject';

let collection;

describe('findByIds', function() {

  before(function(done){
    MongoClient.connect(url, {}, function(err, db) {
      const docs = [ 
      {
        "_id": ObjectId("583291a1638566b3c5a92ca0"),
        "username" : "tmeasday",
      }, 
      {
        "_id": ObjectId("583291a1638566b3c5a92ca1"),
        "username" : "stubailo",
      }, 
      {
        "_id": ObjectId("583291a1638566b3c5a92ca2"),
        "username" : "lacker",
      }
      ];
      collection = db.collection('user');
      collection.insert(docs, function(err, result) {
        done();
      });
    });
  });

  it('cannot get any user profile with id: ""', async function(){
    const id = "";
    const authQuery = {};
    const loader = new DataLoader(ids => findByIds(collection, ids, authQuery));
    const result = await loader.load(id);
    //assert.isUndefined(result);
  });

  it('can get user profile "stubailo" with id: ObjectId("583291a1638566b3c5a92ca1")', async function(){
    const id = ObjectId("583291a1638566b3c5a92ca1");
    const authQuery = {};
    const loader = new DataLoader(ids => findByIds(collection, ids, authQuery));
    const result = await loader.load(id);
    assert.isObject(result);
    //assert.equal(result.username, 'stubailo');
  });

  it('can get user profile "stubailo" with id: ObjectId("583291a1638566b3c5a92ca1") and authQuery: { "username" : "stubailo" }', async function(){
    const id = ObjectId("583291a1638566b3c5a92ca1");
    const authQuery = {
      "username" : "stubailo"
    };
    const loader = new DataLoader(ids => findByIds(collection, ids, authQuery));
    const result = await loader.load(id);
    assert.isObject(result);
    //assert.equal(result.username, 'stubailo');
  });

  it('cannot get user profile "stubailo" with id: ObjectId("583291a1638566b3c5a92ca1") and me.username = "lacker"', async function(){
    const id = ObjectId("583291a1638566b3c5a92ca1");
    const me = {
      "_id": ObjectId("583291a1638566b3c5a92ca2"),
      "username": "lacker"
    }
    const authQuery = queryForRoles(me, [], ['_id'], { User }, authlog('findByIds', 'testMode', me));
    const loader = new DataLoader(ids => findByIds(collection, ids, authQuery));
    const result = await loader.load(id);
    //assert.isUndefined(result);
  });

});