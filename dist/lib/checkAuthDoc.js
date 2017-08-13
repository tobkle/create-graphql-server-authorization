"use strict";

var _userRoleAuthorized = require("./userRoleAuthorized");

var _userRoleAuthorized2 = _interopRequireDefault(_userRoleAuthorized);

var _fieldContainsUserId = require("./fieldContainsUserId");

var _fieldContainsUserId2 = _interopRequireDefault(_fieldContainsUserId);

var _authlog = require("./authlog");

var _authlog2 = _interopRequireDefault(_authlog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultLogger = (0, _authlog2.default)();

/*
 * Returns an authorized document
 * @param {object} doc
 * @param {object} me
 * @param {array} userRoles
 * @param {array} docRoles
 * @param {object} User
 * @param {function} logger
 * @return {object} doc
 */

function checkAuthDoc() {
  var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var me = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var userRoles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var docRoles = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var _ref = arguments[4];
  var User = _ref.User;
  var logger = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : defaultLogger;

  var resultDoc = Object.assign({}, doc);

  // get the User's role
  var role = User.authRole(me);

  // check if userRole entitles current user for this action
  if ((0, _userRoleAuthorized2.default)(me, userRoles, { User: User }, logger)) {
    logger.debug("and role: \"" + role + "\" is authorized by userRole.");
    return resultDoc;
  }

  // check if docRole entitles current user for this document and action
  var authorized = false;
  docRoles.every(function (field) {
    if (resultDoc[field] && me._id && (0, _fieldContainsUserId2.default)(resultDoc[field], me._id)) {
      authorized = true;
    }
  });
  if (authorized) {
    logger.debug("and role: \"" + role + "\" is authorized by docRole.");
    return resultDoc;
  }

  // Not Authorized, throw exception in logger.error
  logger.error("and role: \"" + role + "\" is not authorized.");
}

module.exports = checkAuthDoc;