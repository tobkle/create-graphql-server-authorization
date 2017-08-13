/*
 * Provides access to all public 
 * create graphql server 
 * authorization functions
 */
var authorization = {};

authorization.version = require('../package.json').version;
authorization.getLogFilename = require('./lib/getLogFilename.js'); 
authorization.dummyUserContext = require('./lib/dummyUserContext.js";'); 
authorization.logger = require('./lib/logger.js'); 
authorization.authlog = require('./lib/authlog.js'); 
authorization.checkAuthDoc = require('./lib/checkAuthDoc.js'); 
authorization.fieldContainsUserId = require('./lib/fieldContainsUserId.js'); 
authorization.findByIds = require('./lib/findByIds.js'); 
authorization.loggedIn = require('./lib/loggedIn.js'); 
authorization.protectFields = require('./lib/protectFields.js'); 
authorization.queryForRoles = require('./lib/queryForRoles.js'); 
authorization.userRoleAuthorized = require('./lib/userRoleAuthorized.js');

module.exports = authorization;
