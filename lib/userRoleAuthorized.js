'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userRoleAuthorized = userRoleAuthorized;

var _constants = require('../constants');

var _dummyUserContext = require('./dummyUserContext');

var _authlog = require('./authlog');

var defaultLogger = (0, _authlog.authlog)();

/**
 * Is a user's role authorized for a document
 * You can use also the role 'world', to authorize everyone
 * @public
 * @param {object} me - current user
 * @param {array} userRoles - list of userRoles
 * @param {object} User - model context for type User
 * @param {object} logger - logger function
 * @return {boolean} authorized - true, if userRole is authorized
 */

function userRoleAuthorized() {
  var me = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var userRoles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { User: _dummyUserContext.dummyUserContext },
      User = _ref.User;

  var logger = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : defaultLogger;

  // get current User's role
  var role = User.authRole(me);

  // determine, if the given userRoles authorize the current User by its role
  if (
  // userRole: 'world' should authorize everyone - known and unknown users
  userRoles.includes(_constants.WORLD) ||
  // or there must be a userRole given, and current user must have a role
  // and the current user's role must be in the given userRoles
  role && role !== '' && userRoles.length > 0 && userRoles.includes(role)) {
    // => authorized
    logger.debug('and role \'' + (role ? role : _constants.NO_ROLE) + '\' is authorized');
    return true;
  }

  // => not authorized
  return false;
}