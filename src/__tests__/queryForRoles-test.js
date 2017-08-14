/* eslint-disable max-len */
import { queryForRoles } from '../lib/queryForRoles';
import { dummyUserContext } from '../lib/dummyUserContext';
import { authlog } from '../lib/authlog';

const expect = require('chai').expect;
const assert = require('chai').assert;

// mocking User authRole, as it is not existing in this library
const User = dummyUserContext;
const mode = 'testMode';
const not_authorized = 'is not authorized';

describe('queryForRoles', function() {
  it('should throw an exception on empty call', function() {
    const resolver = 'queryForRoles-01';
    const me = {};
    const userRoles = [];
    const docRoles = [];

    let result = {};
    const testFunction = function() {
      result = queryForRoles(
        me,
        userRoles,
        docRoles,
        { User },
        authlog(resolver, mode, me)
      );
      return result;
    };

    expect(testFunction).to.throw(not_authorized);
  });

  it('should throw an exception on insufficent authorization data', function() {
    const resolver = 'queryForRoles-02';
    const me = {};
    const userRoles = [];
    const docRoles = [];

    let result = {};
    const testFunction = function() {
      result = queryForRoles(
        me,
        userRoles,
        docRoles,
        { User },
        authlog(resolver, mode, me)
      );
      return result;
    };

    expect(testFunction).to.throw(not_authorized);
  });

  it('should throw an exception if not authorized by userRoles or docRoles', function() {
    const resolver = 'queryForRoles-03';
    const me = {};
    const userRoles = ['admin', 'super'];
    const docRoles = ['authorId', 'coauthorsIds'];

    let result = {};
    const testFunction = function() {
      result = queryForRoles(
        me,
        userRoles,
        docRoles,
        { User },
        authlog(resolver, mode, me)
      );
      return result;
    };

    expect(testFunction).to.throw(not_authorized);
  });

  it('should NOT authorize on userRoles: ["super", admin"] and me.role: "other"', function() {
    const resolver = 'queryForRoles-04';
    const me = {
      _id: { $oid: '583291a1638566b3c5a92ca1' },
      username: 'tobkle',
      role: 'other'
    };
    const userRoles = ['admin', 'super'];
    const docRoles = [];

    let result = {};
    const testFunction = function() {
      result = queryForRoles(
        me,
        userRoles,
        docRoles,
        { User },
        authlog(resolver, mode, me)
      );
      return result;
    };

    expect(testFunction).to.throw(not_authorized);
  });

  it('should authorize on userRoles: ["admin"] and me.role: "admin"', function() {
    const resolver = 'queryForRoles-05';
    const me = {
      _id: { $oid: '583291a1638566b3c5a92ca1' },
      username: 'tobkle',
      role: 'admin'
    };
    const userRoles = ['admin'];
    const docRoles = [];

    let result = {};
    const testFunction = function() {
      result = queryForRoles(
        me,
        userRoles,
        docRoles,
        { User },
        authlog(resolver, mode, me)
      );
      return result;
    };

    const expectedResult = {};

    expect(testFunction).to.not.throw();
    assert.deepEqual(result, expectedResult);
  });

  it('should authorize on userRoles: ["super", admin"] and me.role: "admin"', function() {
    const resolver = 'queryForRoles-06';
    const me = {
      _id: { $oid: '583291a1638566b3c5a92ca1' },
      username: 'tobkle',
      role: 'admin'
    };
    const userRoles = ['super', 'admin'];
    const docRoles = [];

    let result = {};
    const testFunction = function() {
      result = queryForRoles(
        me,
        userRoles,
        docRoles,
        { User },
        authlog(resolver, mode, me)
      );
      return result;
    };

    const expectedResult = {};

    expect(testFunction).to.not.throw();
    assert.deepEqual(result, expectedResult);
  });

  it('should authorize on docRoles: ["authorId"] with authQuery: { $or: [ {"authorId" : me._id } ] }', function() {
    const resolver = 'queryForRoles-07';
    const me = {
      _id: { $oid: '583291a1638566b3c5a92ca1' },
      username: 'tobkle',
      role: 'admin'
    };
    const userRoles = [];
    const docRoles = ['authorId'];

    let result = {};
    const testFunction = function() {
      result = queryForRoles(
        me,
        userRoles,
        docRoles,
        { User },
        authlog(resolver, mode, me)
      );
      return result;
    };

    const expectedResult = {
      $or: [
        {
          authorId: { $oid: '583291a1638566b3c5a92ca1' }
        }
      ]
    };

    expect(testFunction).to.not.throw();
    assert.deepEqual(result, expectedResult);
  });

  it('should authorize on docRoles: ["authorId"] with authQuery: { $or: [ {"authorId": me._id }, { "coAuthorsIds": me._id } ] }', function() {
    const resolver = 'queryForRoles-08';
    const me = {
      _id: { $oid: '583291a1638566b3c5a92ca1' },
      username: 'tobkle',
      role: 'admin'
    };
    const userRoles = [];
    const docRoles = ['authorId', 'coauthorsIds'];

    let result = {};
    const testFunction = function() {
      result = queryForRoles(
        me,
        userRoles,
        docRoles,
        { User },
        authlog(resolver, mode, me)
      );
      return result;
    };

    const expectedResult = {
      $or: [
        {
          authorId: { $oid: '583291a1638566b3c5a92ca1' }
        },
        {
          coauthorsIds: { $oid: '583291a1638566b3c5a92ca1' }
        }
      ]
    };

    expect(testFunction).to.not.throw();
    assert.deepEqual(result, expectedResult);
  });

  it('should authorize on userRoles: ["super", admin"] and me.role: "admin" and docRoles: ["authorId"]', function() {
    const resolver = 'queryForRoles-09';
    const me = {
      _id: { $oid: '583291a1638566b3c5a92ca1' },
      username: 'tobkle',
      role: 'admin'
    };
    const userRoles = ['admin'];
    const docRoles = ['authorId'];

    let result = {};
    const testFunction = function() {
      result = queryForRoles(
        me,
        userRoles,
        docRoles,
        { User },
        authlog(resolver, mode, me)
      );
      return result;
    };

    const expectedResult = {};

    expect(testFunction).to.not.throw();
    assert.deepEqual(result, expectedResult);
  });

  it('should authorize on userRoles: ["super", admin"] and me.role: "admin" and docRoles: ["authorId"]', function() {
    const resolver = 'queryForRoles-10';
    const me = {
      _id: { $oid: '583291a1638566b3c5a92ca1' },
      username: 'tobkle',
      role: 'admin'
    };
    const userRoles = ['super', 'admin'];
    const docRoles = ['authorId', 'coAuthorsIds'];

    let result = {};
    const testFunction = function() {
      result = queryForRoles(
        me,
        userRoles,
        docRoles,
        { User },
        authlog(resolver, mode, me)
      );
      return result;
    };

    const expectedResult = {};

    expect(testFunction).to.not.throw();
    assert.deepEqual(result, expectedResult);
  });

  it('should authorize on userRoles: ["world"]', function() {
    const resolver = 'queryForRoles-11';
    const me = {};
    const userRoles = ['world'];
    const docRoles = [];

    let result = {};
    const testFunction = function() {
      result = queryForRoles(
        me,
        userRoles,
        docRoles,
        { User },
        authlog(resolver, mode, me)
      );
      return result;
    };

    const expectedResult = {};

    expect(testFunction).to.not.throw();
    assert.deepEqual(result, expectedResult);
  });
});
