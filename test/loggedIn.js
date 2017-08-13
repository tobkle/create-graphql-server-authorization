// import { ObjectId } from 'mongodb';
import ObjectId from 'bson-objectid';

import loggedIn from "../dist/lib/loggedIn";

var expect = require('chai').expect;
var assert = require('chai').assert;

describe('loggedIn', function() {

  it('should return false, if not logged in', function() {
    var me = {};
    var result = loggedIn(me);
    assert.isFalse(result);
  });

  it('should return true, if logged in', function() {
    var me = {
      "_id": ObjectId("583291a1638566b3c5a92ca0"),
      "username" : "tmeasday",
    };
    var result = loggedIn(me);
    assert.isTrue(result);
  });

});
