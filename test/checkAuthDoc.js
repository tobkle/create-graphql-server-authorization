import authlog from "../dist/lib/authlog";
import checkAuthDoc from "../dist/lib/checkAuthDoc";
import dummyUserContext from "../dist/lib/dummyUserContext";

const expect = require('chai').expect;
const assert = require('chai').assert;

// mocking User authRole, as it is not existing in this library
const User = dummyUserContext;

const resolver = 'checkAuth';
const mode = 'testMode';
const doc = {
  "_id":{"$oid":"583676d3618530145474e352"},
  "authorId":{"$oid":"583291a1638566b3c5a92ca1"},
  "otherExistingField":{"$oid":"583291a1638566b3c5a91111"},
  "secret": "password",
};

const authorized = 'is authorized';
const not_authorized = 'is not authorized';

// Call pattern:
// checkAuthDoc(docToInsert, me, ['admin'], ['_id'], { User: this.context.User }, authlog(resolver, 'create', me));

describe('checkAuthDoc', function() {

  it('should NOT authorize on empty me, empty userRoles, empty docRoles', function() {
    const userRoles = [];
    const docRoles = [];
    const me = {};

    let result = {};
    const testFunction = function () {
      result = checkAuthDoc(doc, me, userRoles, docRoles, { User }, authlog(resolver, mode, me ) );
      return result;
    }
    expect(testFunction).to.throw(not_authorized);
  });

  it('should NOT authorize on empty me, empty userRoles, docRoles: ["authorId"]', function() {
    const userRoles = [];
    const docRoles = ["authorId"];
    const me = {};

    let result = {};
    const testFunction = function () {
      result = checkAuthDoc(doc, me, userRoles, docRoles, { User }, authlog(resolver, mode, me ) );
      return result;
    }
    expect(testFunction).to.throw(not_authorized);
  });

  it('should NOT authorize on empty me, userRoles: ["admin"], empty docRoles', function() {
    const userRoles = ["admin"];
    const docRoles = [];
    const me = {};

    let result = {};
    const testFunction = function () {
      result = checkAuthDoc(doc, me, userRoles, docRoles, { User }, authlog(resolver, mode, me ) );
      return result;
    }
    expect(testFunction).to.throw(not_authorized);
  });

  it('should NOT authorize on me: "tobkle", empty userRoles, empty docRoles', function() {
    const userRoles = [];
    const docRoles = [];
    const me = {
      "_id": {"$oid":"583291a1638566b3c5a92ca1"},
      "username": "tobkle"
    };

    let result = {};
    const testFunction = function () {
      result = checkAuthDoc(doc, me, userRoles, docRoles, { User }, authlog(resolver, mode, me ) );
      return result;
    }
    expect(testFunction).to.throw(not_authorized);
  });

  it('should NOT authorize on me.role: "admin", but empty userRoles, empty docRoles', function() {
    const userRoles = [];
    const docRoles = [];
    const me = {
      "_id": {"$oid":"583291a1638566b3c5a92ca1"},
      "username": "tobkle",
      "role": "admin"
    };

    let result = {};
    const testFunction = function () {
      result = checkAuthDoc(doc, me, userRoles, docRoles, { User }, authlog(resolver, mode, me ) );
      return result;
    }
    expect(testFunction).to.throw(not_authorized);
  });

  it('should not authorize on me.role: "admin" and userRoles: ["superadmin"]', function() {
    const userRoles = ["superadmin"];
    const docRoles = [];
    const me = {
      "_id": {"$oid":"583291a1638566b3c5a92ca1"},
      "username": "tobkle",
      "role": "admin"
    };

    let result = {};
    const testFunction = function () {
      result = checkAuthDoc(doc, me, userRoles, docRoles, { User }, authlog(resolver, mode, me ) );
      return result;
    }
    expect(testFunction).to.throw(not_authorized);
  });

  it('should authorize on me.role="admin" and userRoles: ["admin"]', function() {
    const userRoles = ['admin'];
    const docRoles = [];
    const me = {
      "_id": {"$oid":"583291a1638566b3c5a92ca1"},
      "username": "tobkle",
      "role": "admin"
    };

    let result = {};
    const testFunction = function () {
      result = checkAuthDoc(doc, me, userRoles, docRoles, { User }, authlog(resolver, mode, me ) );
      return result;
    }
    expect(testFunction).to.not.throw();
    assert.isObject(result);
    assert.property(result, 'secret');
    expect(result.secret).to.equal('password');
  });

  it('should not authorize on docRoles: ["notExistingField"]', function() {
    const userRoles = [];
    const docRoles = ["notExistingField"];
    const me = {
      "_id": {"$oid":"583291a1638566b3c5a92ca1"},
      "username": "tobkle",
      "role": "admin"
    };

    let result = {};
    const testFunction = function () {
      result = checkAuthDoc(doc, me, userRoles, docRoles, { User }, authlog(resolver, mode, me ) );
      return result;
    }
    expect(testFunction).to.throw(not_authorized);
  });
  
  it('should not authorize on docRoles: ["otherExistingField"] but other me._id', function() {
    const userRoles = [];
    const docRoles = ["otherExistingField"];
    const me = {
      "_id": {"$oid":"583291a1638566b3c5a92ca1"},
      "username": "tobkle",
      "role": "admin"
    };

    let result = {};
    const testFunction = function () {
      result = checkAuthDoc(doc, me, userRoles, docRoles, { User }, authlog(resolver, mode, me ) );
      return result;
    }
    expect(testFunction).to.throw(not_authorized);
  });

  it('should not authorize on docRoles: ["authorId"] but other me._id', function() {
    const userRoles = [];
    const docRoles = ["authorId"];
    const me = {
      "_id": {"$oid":"583291a1638566b3c5a92000"},
      "username": "tobkle",
      "role": "admin"
    };

    let result = {};
    const testFunction = function () {
      result = checkAuthDoc(doc, me, userRoles, docRoles, { User }, authlog(resolver, mode, me ) );
      return result;
    }
    expect(testFunction).to.throw(not_authorized);
  });

  it('should authorize on docRoles: ["authorId"] and (me._id === doc.authorId)', function() {
    const userRoles = [];
    const docRoles = ["authorId"];
    const me = {
      "_id": {"$oid":"583291a1638566b3c5a92ca1"},
      "username": "tobkle",
      "role": "admin"
    };

    let result = {};
    const testFunction = function () {
      result = checkAuthDoc(doc, me, userRoles, docRoles, { User }, authlog(resolver, mode, me ) );
      return result;
    }
    expect(testFunction).to.not.throw();
    assert.isObject(result);
    assert.property(result, 'secret');
    expect(result.secret).to.equal('password');
  });

});