import protectFields from "../dist/lib/protectFields";
import dummyUserContext from "./dummyUserContext";

const expect = require('chai').expect;
const assert = require('chai').assert;

// mocking User authRole, as it is not existing in this library
const User = dummyUserContext;

const inputObject = {
  "_id": {"$oid":"583676d3618530145474e350"},
  "authorId": {"$oid":"583291a1638566b3c5a92ca0"},
  "coauthorsIds": [
    {"$oid":"583291a1638566b3c5a92ca1"},
    {"$oid":"583291a1638566b3c5a92ca2"}
  ],
  "body": "A #graphql-first development workflow based on real world lessons, from @danimman \u0026 @stubailo:",
  "createdAt": 1.479964340853e+12,
  "updatedAt": 1.479964340853e+12, 
  "createdById": {"$oid":"583291a1638566b3c5a92ca1"}, 
  "updatedById": {"$oid":"583291a1638566b3c5a92ca1"},
  "secret": "password"
}

describe('protectFields', function() {

  it('on no proctectedFields, inputObject should be equal to resultObject', function() {
    const me = {};
    const authorizedUserRoles = [];
    const protectedFields = [];

    var result = protectFields(me, authorizedUserRoles, protectedFields, inputObject, { User } );

    assert.isObject(result);
    assert.deepEqual(inputObject, result);
  });

  it('on proctectedFields: ["secret"], outputObject (without "secret") should be equal to resultObject', function() {
    const me = {};
    const authorizedUserRoles = [];
    const protectedFields = ["secret"];
    const outputObject = {
      "_id": {"$oid":"583676d3618530145474e350"},
      "authorId": {"$oid":"583291a1638566b3c5a92ca0"},
      "coauthorsIds": [
        {"$oid":"583291a1638566b3c5a92ca1"},
        {"$oid":"583291a1638566b3c5a92ca2"}
      ],
      "body": "A #graphql-first development workflow based on real world lessons, from @danimman \u0026 @stubailo:",
      "createdAt": 1.479964340853e+12,
      "updatedAt": 1.479964340853e+12, 
      "createdById": {"$oid":"583291a1638566b3c5a92ca1"}, 
      "updatedById": {"$oid":"583291a1638566b3c5a92ca1"}
    };

    var result = protectFields(me, authorizedUserRoles, protectedFields, inputObject, { User } );

    assert.isObject(result);
    assert.deepEqual(outputObject, result);
  });

  it('on proctectedFields: ["secret", "authorId"], outputObject (without "secret", "authorId") should be equal to resultObject', function() {
    const me = {};
    const authorizedUserRoles = [];
    const protectedFields = ["secret", "authorId"];
    const outputObject = {
      "_id": {"$oid":"583676d3618530145474e350"},
      "coauthorsIds": [
        {"$oid":"583291a1638566b3c5a92ca1"},
        {"$oid":"583291a1638566b3c5a92ca2"}
      ],
      "body": "A #graphql-first development workflow based on real world lessons, from @danimman \u0026 @stubailo:",
      "createdAt": 1.479964340853e+12,
      "updatedAt": 1.479964340853e+12, 
      "createdById": {"$oid":"583291a1638566b3c5a92ca1"}, 
      "updatedById": {"$oid":"583291a1638566b3c5a92ca1"}
    };

    var result = protectFields(me, authorizedUserRoles, protectedFields, inputObject, { User } );

    assert.isObject(result);
    assert.deepEqual(outputObject, result);
  });

  it('if all fields are proctectedFields, empty object {} should be equal to resultObject', function() {
    const me = {};
    const authorizedUserRoles = [];
    const protectedFields = ["_id", "authorId", "coauthorsIds", "body", "createdAt", "updatedAt", "createdById", "updatedById", "secret"];
    const outputObject = {};

    var result = protectFields(me, authorizedUserRoles, protectedFields, inputObject, { User } );

    assert.isObject(result);
    assert.deepEqual(outputObject, result);
  });

  it('on proctectedFields: ["secret"] and authorized User, resultObject should include field "secret"', function() {
    const me = {
      "_id": {"$oid":"583291a1638566b3c5a92ca1"},
      "username": "tmeasday",
      "role": "admin"
    };
    const authorizedUserRoles = ["admin"];
    const protectedFields = ["secret"];
    const outputObject = {
      "_id": {"$oid":"583676d3618530145474e350"},
      "authorId": {"$oid":"583291a1638566b3c5a92ca0"},
      "coauthorsIds": [
        {"$oid":"583291a1638566b3c5a92ca1"},
        {"$oid":"583291a1638566b3c5a92ca2"}
      ],
      "body": "A #graphql-first development workflow based on real world lessons, from @danimman \u0026 @stubailo:",
      "createdAt": 1.479964340853e+12,
      "updatedAt": 1.479964340853e+12, 
      "createdById": {"$oid":"583291a1638566b3c5a92ca1"}, 
      "updatedById": {"$oid":"583291a1638566b3c5a92ca1"},
      "secret": "password"
    };

    var result = protectFields(me, authorizedUserRoles, protectedFields, inputObject, { User } );

    assert.isObject(result);
    assert.deepEqual(outputObject, result);
  });

  it('on proctectedFields: ["secret", "authorId"] and authorized User, resultObject should include field "secret" and "authorId"', function() {
    const me = {
      "_id": {"$oid":"583291a1638566b3c5a92ca1"},
      "username": "tmeasday",
      "role": "admin"
    };
    const authorizedUserRoles = ["admin"];
    const protectedFields = ["secret", "authorId"];
    const outputObject = {
      "_id": {"$oid":"583676d3618530145474e350"},
      "authorId": {"$oid":"583291a1638566b3c5a92ca0"},
      "coauthorsIds": [
        {"$oid":"583291a1638566b3c5a92ca1"},
        {"$oid":"583291a1638566b3c5a92ca2"}
      ],
      "body": "A #graphql-first development workflow based on real world lessons, from @danimman \u0026 @stubailo:",
      "createdAt": 1.479964340853e+12,
      "updatedAt": 1.479964340853e+12, 
      "createdById": {"$oid":"583291a1638566b3c5a92ca1"}, 
      "updatedById": {"$oid":"583291a1638566b3c5a92ca1"},
      "secret": "password"
    };

    var result = protectFields(me, authorizedUserRoles, protectedFields, inputObject, { User } );

    assert.isObject(result);
    assert.deepEqual(outputObject, result);
  });

});