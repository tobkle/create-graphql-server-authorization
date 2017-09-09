"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});


/**
 * Returns a dummyUserContext
 * mocking User authRole, as it is not existing in this library
 * for usage in the test cases, where we don't have an original 
 * User model context
 * @public
 * @return {object} dummyUserContext - returns user.role || null
 */

var dummyUserContext = exports.dummyUserContext = {
  authRole: function authRole(user) {
    return user && user.role ? user.role : null;
  }
};