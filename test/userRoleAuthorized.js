import userRoleAuthorized from "../dist/lib/userRoleAuthorized";
import dummyUserContext from "../dist/lib/dummyUserContext";
import authlog from "../dist/lib/authlog";

const expect = require('chai').expect;
const assert = require('chai').assert;

const defaultLogger = authlog();

// mocking User authRole, as it is not existing in this library
const User = dummyUserContext;
const resolver = 'userRoleAuthorized';
const mode = 'testMode';

describe('userRoleAuthorized', function() {

  it('should return false, on empty call', function() {
    const me = {};
    const userRoles = [];

    var result = userRoleAuthorized();

    assert.isFalse(result);
  });

  it('should return false, on empty variables', function() {
    const me = {};
    const userRoles = [];

    var result = userRoleAuthorized(me, userRoles, { User }, authlog(resolver, mode, me ));

    assert.isFalse(result);
  });

  it('should return false, if userRole is empty', function() {
    const me = {
      "_id": {"$oid":"583291a1638566b3c5a92ca1"},
      "username": "tmeasday",
      "role": "admin"
    };
    const userRoles = [];

    var result = userRoleAuthorized(me, userRoles, { User }, authlog(resolver, mode, me ) );

    assert.isFalse(result);
  });

  it('should return false, if userRole "admin" is not authorized with userRole "super"', function() {
    const me = {
      "_id": {"$oid":"583291a1638566b3c5a92ca1"},
      "username": "tmeasday",
      "role": "admin"
    };
    const userRoles = ["super"];

    var result = userRoleAuthorized(me, userRoles, { User }, authlog(resolver, mode, me ) );

    assert.isFalse(result);
  });

  it('should return true, if userRole "admin" is authorized by me.role: "admin"', function() {
    const me = {
      "_id": {"$oid":"583291a1638566b3c5a92ca1"},
      "username": "tmeasday",
      "role": "admin"
    };
    const userRoles = ["admin"];

    var result = userRoleAuthorized(me, userRoles, { User }, authlog(resolver, mode, me ) );

    assert.isTrue(result);
  });

  it('should return true, if userRoles: ["super", "admin"] is authorized by me.role: "admin"', function() {
    const me = {
      "_id": {"$oid":"583291a1638566b3c5a92ca1"},
      "username": "tmeasday",
      "role": "admin"
    };
    const userRoles = ["super", "admin"];

    var result = userRoleAuthorized(me, userRoles, { User }, authlog(resolver, mode, me ) );

    assert.isTrue(result);
  });

});