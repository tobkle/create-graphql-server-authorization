'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryForRoles = queryForRoles;

var _constants = require('../constants');

var _userRoleAuthorized = require('./userRoleAuthorized');

var _dummyUserContext = require('./dummyUserContext');

var _loggedIn = require('./loggedIn');

var _authlog = require('./authlog');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /* eslint-disable max-len */


var defaultLogger = (0, _authlog.authlog)();

/**
 * Prepare a query object for mongodb operations with authorization queries
 * creates an authQuery object with additional 
 * query arguments, to implement authorization restrictions for mongodb access
 * @public
 * @param {object} me - current user
 * @param {array} userRoles - list of userRoles
 * @param {array} docRoles - list of docRoles
 * @param {object} User - model context for type User
 * @param {object} logger - logger function
 * @return {object} authQuery - authQuery for data operations
 * @example 
 *   const authQuery = 
 *     queryForRoles(me, userRoles, docRoles, { User }, authlog(resolver, mode, me ) );
 */

function queryForRoles() {
  var me = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var userRoles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var docRoles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { User: _dummyUserContext.dummyUserContext },
      User = _ref.User;

  var logger = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : defaultLogger;

  // get current User's role
  var role = User.authRole(me);

  // Build query for the case: The logged in user's role is authorized
  if ((0, _userRoleAuthorized.userRoleAuthorized)(me, userRoles, { User: User }, logger)) {
    // empty authQuery means, do operation with no access restrictions
    var authQuery = {};
    if (logger.registerLoader) {
      // on authorization, register authorizedLoader (dataloader) method
      // in the model's context, is only used in constructors
      // with the alternative logging function 'onAuthRegisterLoader'
      logger.registerLoader(authQuery);
    }
    return authQuery;
  }

  // Build query for the case: The user is listed in any document field
  var query = { $or: [] };
  // makes only sense, if user is logged in - otherwise no userId
  if ((0, _loggedIn.loggedIn)(me)) {
    // prepare selection criterias as 'authQuery' object
    // for later mongodb 'find(...baseQuery,  ...authQuery)'
    //                               ...  AND ...{ field1 OR field2}
    // which will be also considered during the database access
    // as an '$or: [ { field1: userId}, { field2: userId} ]'
    // with all document roles as fields for the later selection.
    // At least one of those fields must match the userId,
    // otherwise, whether no data found or not authorized to access data
    docRoles.forEach(function (docRole) {
      return query.$or.push(_defineProperty({}, docRole, me._id));
    });
    // return this authQuery only, if there was at least 1 field added
    // otherwise it will result in an unlimited access
    if (query.$or.length > 0) {
      if (logger.registerLoader) {
        // on authorization, register authorizedLoader (dataloader) method
        // in the model's context, is only used in constructors
        // with the alternative logging function 'onAuthRegisterLoader'
        logger.registerLoader(query);
      }
      // for easier debugging write into the authorzation logs
      logger.debug('and role: \'' + (role ? role : _constants.NO_ROLE) + '\' with \n        authQuery: ' + JSON.stringify(query, null, 2));
      // return the query as authQuery for later selection
      return query;
    }
  }

  // Whether...
  // if the logger = authLog as the transferred logger, then:
  // Not Authorized - throw exception in logger.error

  // ...or...

  // if the logger = onAuthRegisterLoader as the transferred logger, then:
  // Not Authorized - write only message in logger.error
  // This one is only used in constructors,
  // avoiding errors during initial graphql setup
  var message = 'and role: \'' + role + '\' is not authorized.';
  logger.error(message);
}