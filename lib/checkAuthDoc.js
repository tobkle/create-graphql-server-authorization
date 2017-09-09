'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAuthDoc = checkAuthDoc;

var _userRoleAuthorized = require('./userRoleAuthorized');

var _fieldContainsUserId = require('./fieldContainsUserId');

var _authlog = require('./authlog');

// default logger, if there is none given
var defaultLogger = (0, _authlog.authlog)();

/**
 * Returns an authorized document
 * @public
 * @param {object} doc - any document to be checked
 * @param {object} me - current user
 * @param {array} userRoles - list of userRoles
 * @param {array} docRoles - list of docRoles
 * @param {object} User - model context of type User
 * @param {function} logger - the logger function
 * @return {object} doc - returns the authorized document
 * @throws {Error} - throws on a missing authorization
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
  if ((0, _userRoleAuthorized.userRoleAuthorized)(me, userRoles, { User: User }, logger)) {
    logger.debug('and role: \'' + role + '\' is authorized by userRole.');
    return resultDoc;
  }

  // check if docRole entitles current user for this document and action
  var authorized = false;
  docRoles.every(function (field) {
    if (resultDoc[field] && me._id && (0, _fieldContainsUserId.fieldContainsUserId)(resultDoc[field], me._id)) {
      authorized = true;
    }
  });
  if (authorized) {
    logger.debug('and role: \'' + role + '\' is authorized by docRole.');
    return resultDoc;
  }

  // Not Authorized, throw exception in logger.error
  logger.error('and role: \'' + role + '\' is not authorized.');
}