'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getLogFilename = require('./lib/getLogFilename');

var _getLogFilename2 = _interopRequireDefault(_getLogFilename);

var _logger = require('./lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _authlog = require('./lib/authlog');

var _authlog2 = _interopRequireDefault(_authlog);

var _checkAuthDoc = require('./lib/checkAuthDoc');

var _checkAuthDoc2 = _interopRequireDefault(_checkAuthDoc);

var _fieldContainsUserId = require('./lib/fieldContainsUserId');

var _fieldContainsUserId2 = _interopRequireDefault(_fieldContainsUserId);

var _findByIds = require('./lib/findByIds');

var _findByIds2 = _interopRequireDefault(_findByIds);

var _loggedIn = require('./lib/loggedIn');

var _loggedIn2 = _interopRequireDefault(_loggedIn);

var _protectFields = require('./lib/protectFields');

var _protectFields2 = _interopRequireDefault(_protectFields);

var _queryForRoles = require('./lib/queryForRoles');

var _queryForRoles2 = _interopRequireDefault(_queryForRoles);

var _userRoleAuthorized = require('./lib/userRoleAuthorized');

var _userRoleAuthorized2 = _interopRequireDefault(_userRoleAuthorized);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Provides access to all public 
 * create graphql server 
 * authorization functions
 */

exports.default = {
  getLogFilename: _getLogFilename2.default,
  logger: _logger2.default,
  authlog: _authlog2.default,
  checkAuthDoc: _checkAuthDoc2.default,
  fieldContainsUserId: _fieldContainsUserId2.default,
  findByIds: _findByIds2.default,
  loggedIn: _loggedIn2.default,
  protectFields: _protectFields2.default,
  queryForRoles: _queryForRoles2.default,
  userRoleAuthorized: _userRoleAuthorized2.default
};