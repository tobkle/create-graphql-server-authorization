"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = queryForRoles;

var _userRoleAuthorized = require("./userRoleAuthorized");

var _userRoleAuthorized2 = _interopRequireDefault(_userRoleAuthorized);

var _loggedIn = require("./loggedIn");

var _loggedIn2 = _interopRequireDefault(_loggedIn);

var _logger = require("./logger");

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Prepare a query object for mongodb operations with authorization queries
 * creates an authQuery object with additional query arguments, to implement authorization restrictions for mongodb access
 * @param {object} me
 * @param {array} userRoles
 * @param {array} docRoles
 * @param {object} inputObject
 * @param {object} User
 * @param {object} logger
 * @return {object} queryObject
 */

function queryForRoles() {
  var me = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var userRoles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var docRoles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var _ref = arguments[3];
  var User = _ref.User;
  var logger = arguments[4];

  var role = User.authRole(me);

  // Build query for the case: The logged in user's role is authorized
  if ((0, _userRoleAuthorized2.default)(me, userRoles, { User: User }, logger)) {
    return {}; // empty authQuery means, do operation with no access restrictions
  }

  // Build query for the case: The user is listed in any document field
  var query = { $or: [] };
  if ((0, _loggedIn2.default)(me)) {
    docRoles.forEach(function (docRole) {
      return query.$or.push(_defineProperty({}, docRole, me._id));
    });
    logger.debug("and role: \"" + (role ? role : "<no-role>") + "\" with \nauthQuery: " + JSON.stringify(query, null, 2));
    if (query.$or.length > 0) return query;
  }

  // Not Authorized
  var message = "and role: \"" + role + "\" is not authorized.";
  logger.error(message);
}