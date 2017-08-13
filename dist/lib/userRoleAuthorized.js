"use strict";

var _dummyUserContext = require("./dummyUserContext");

var _dummyUserContext2 = _interopRequireDefault(_dummyUserContext);

var _authlog = require("./authlog");

var _authlog2 = _interopRequireDefault(_authlog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultLogger = (0, _authlog2.default)();

/*
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

  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { User: _dummyUserContext2.default },
      User = _ref.User;

  var logger = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : defaultLogger;

  // on insufficient authorization data, it cannot be authorized
  if (!User || !User.authRole || !me || !userRoles) return false;

  // get current User's role
  var role = User.authRole(me);

  // determine, if the given userRoles authorize the current User by its role
  if (
  // userRole: "world" should authorize everyone - known and unknown users
  userRoles.includes("world") ||
  // or there must be a userRole given, and current user must have a role
  // and the current user's role must be in the given userRoles
  role && role !== "" && userRoles.length > 0 && userRoles.includes(role)) {
    // => authorized
    logger.debug("and role \"" + (role ? role : "<no-role>") + "\" is authorized");
    return true;
  }

  // => not authorized
  return false;
}

module.exports = userRoleAuthorized;