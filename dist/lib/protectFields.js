"use strict";

/*
 * Protects a field based on authorizations
 * @param {object} me
 * @param {array} authorizedUserRoles
 * @param {array} protectedFields
 * @param {object} inputObject
 * @param {object} User
 * @return {object} result
 */
function protectFields() {
  var me = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var authorizedUserRoles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var protectedFields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var inputObject = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _ref = arguments[4];
  var User = _ref.User;

  // pure function
  var result = Object.assign({}, inputObject);

  // getting role of current User
  var role = User.authRole(me);

  // if user is not allowed to access specific fields, remove field from object...
  if (!authorizedUserRoles.includes(role)) {
    protectedFields.forEach(function (protectedField) {
      if (result[protectedField]) delete result[protectedField];
    });
  }

  return result;
}

module.exports = protectFields;