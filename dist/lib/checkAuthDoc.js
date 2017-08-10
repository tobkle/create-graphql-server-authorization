"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = checkAuthDoc;

var _userRoleAuthorized = require("./userRoleAuthorized");

var _userRoleAuthorized2 = _interopRequireDefault(_userRoleAuthorized);

var _fieldContainsUserId = require("./fieldContainsUserId");

var _fieldContainsUserId2 = _interopRequireDefault(_fieldContainsUserId);

var _logger = require("./logger");

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns an authorized document
 * @param {string} resolver
 * @param {string} mode
 * @param {object} me
 * @return {
 *    debug {function},
 *    error {function} 
 * }
 */

function checkAuthDoc(doc, me, userRoles, docRoles, _ref, logger) {
  var User = _ref.User;

  var role = User.authRole(me);

  // check if userRole entitles current user for this action
  if ((0, _userRoleAuthorized2.default)(me, userRoles, { User: User }, logger)) {
    logger.debug("and role: \"" + role + "\" is authorized by userRole.");
    return doc;
  }

  // check if docRole entitles current user for this document and action
  var authorized = false;
  docRoles.every(function (field) {
    if ((0, _fieldContainsUserId2.default)(doc[field], me._id)) {
      authorized = true;
    }
  });
  if (authorized) {
    logger.debug("and role: \"" + role + "\" is authorized by docRole.");
    return doc;
  }

  // Not Authorized
  logger.error("and role: \"" + role + "\" is not authorized.");
}