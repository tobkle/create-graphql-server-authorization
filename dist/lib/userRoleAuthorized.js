"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = userRoleAuthorized;
/**
 * Is a user's role authorized for a document
 * @param {object} me
 * @param {array} userRoles
 * @param {object} User
 * @param {object} logger
 * @return {boolean} authorized
 */

// returns true, if the user's role is authorized for a document
function userRoleAuthorized() {
  var me = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var userRoles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var _ref = arguments[2];
  var User = _ref.User;
  var logger = arguments[3];

  var role = User.authRole(me);

  if (userRoles.includes("world") || role && userRoles.length > 0 && userRoles.includes(role)) {
    logger.debug("and role \"" + (role ? role : "<no-role>") + "\" is authorized");
    return true;
  }

  return false;
}