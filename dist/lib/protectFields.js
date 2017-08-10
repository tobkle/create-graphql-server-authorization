"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = protectFields;
/**
 * Protects a field based on authorizations
 * @param {object} me
 * @param {array} authorizedUserRoles
 * @param {array} protectedFields
 * @param {object} inputObject
 * @param {object} User
 * @return {object} result
 */

function protectFields(me, authorizedUserRoles, protectedFields, inputObject, _ref) {
  var User = _ref.User;

  var result = Object.assign({}, inputObject);
  var role = User.authRole(me);
  // if user is not allowed to access specific fields, remove field from object...
  if (!authorizedUserRoles.includes(role)) {
    protectedFields.every(function (protectedField) {
      if (result[protectedField]) delete result[protectedField];
    });
  }
  return result;
}