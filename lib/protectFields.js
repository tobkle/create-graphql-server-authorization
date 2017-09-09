'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.protectFields = protectFields;

var _dummyUserContext = require('./dummyUserContext');

/**
 * Protects a field based on authorizations
 * @public
 * @param {object} me - current user
 * @param {array} authorizedUserRoles - userRoles with authorization
 * @param {array} protectedFields - list of fields only for these userRoles
 * @param {object} inputObject - document with might contain those fields
 * @param {object} User - model context for type User
 * @return {object} result - document with or without the protected fields
 */

function protectFields() {
  var me = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var authorizedUserRoles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var protectedFields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var inputObject = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var _ref = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : { User: _dummyUserContext.dummyUserContext },
      User = _ref.User;

  // pure function
  var result = Object.assign({}, inputObject);

  // getting role of current User
  var role = User.authRole(me);

  // if user is not allowed to access specific fields,
  // remove field from object...
  if (!authorizedUserRoles.includes(role)) {
    protectedFields.forEach(function (protectedField) {
      if (result[protectedField]) {
        delete result[protectedField];
      }
    });
  }

  return result;
}