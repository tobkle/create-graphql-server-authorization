"use strict";

var _userRoleAuthorized = require("./userRoleAuthorized");

var _userRoleAuthorized2 = _interopRequireDefault(_userRoleAuthorized);

var _loggedIn = require("./loggedIn");

var _loggedIn2 = _interopRequireDefault(_loggedIn);

var _dummyUserContext = require("../../test/dummyUserContext");

var _dummyUserContext2 = _interopRequireDefault(_dummyUserContext);

var _authlog = require("./authlog");

var _authlog2 = _interopRequireDefault(_authlog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultLogger = (0, _authlog2.default)();
var User = _dummyUserContext2.default;

/*
 * Prepare a query object for mongodb operations with authorization queries
 * creates an authQuery object with additional query arguments, to implement authorization restrictions for mongodb access
 * @param {object} me
 * @param {array} userRoles
 * @param {array} docRoles
 * @param {object} inputObject
 * @param {object} User
 * @param {object} logger
 * @return {object, exception} queryObject
 *
 * @example: const authQuery = queryForRoles(me, userRoles, docRoles, { User }, authlog(resolver, mode, me ) ); 
 */
function queryForRoles() {
  var me = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var userRoles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var docRoles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { User: _dummyUserContext2.default },
      User = _ref.User;

  var logger = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : defaultLogger;

  // on insufficient authorization data, it cannot be authorized, throws exception
  if (!User || !User.authRole || !me || !userRoles && !docRoles) logger.error(" is not authorized, due to authorization data.");

  // get current User's role
  var role = User.authRole(me);

  // Build query for the case: The logged in user's role is authorized
  if ((0, _userRoleAuthorized2.default)(me, userRoles, { User: User }, logger)) {
    return {}; // empty authQuery means, do operation with no access restrictions
  }

  // Build query for the case: The user is listed in any document field
  var query = { $or: [] };
  // makes only sense, if user is logged in - otherwise no userId
  if ((0, _loggedIn2.default)(me)) {
    // prepare selection criterias as "authQuery" object
    // for later mongodb "find(...baseQuery,  ...authQuery)"
    //                               ...  AND ...{ field1 OR field2}
    // which will be also considered during the database access
    // as an "$or: [ { field1: userId}, { field2: userId} ]"
    // with all document roles as fields for the later selection.
    // At least one of those fields must match the userId,
    // otherwise, whether no data found or not authorized to access data
    docRoles.forEach(function (docRole) {
      return query.$or.push(_defineProperty({}, docRole, me._id));
    });
    // return this authQuery only, if there was at least 1 field added
    // otherwise it will result in an unlimited access
    if (query.$or.length > 0) {
      // for easier debugging write into the authorzation logs
      logger.debug("and role: \"" + (role ? role : "<no-role>") + "\" with \n        authQuery: " + JSON.stringify(query, null, 2));
      // return the query as authQuery for later selection
      return query;
    }
  }

  // Not Authorized - throw exception in logger.error
  var message = "and role: \"" + role + "\" is not authorized.";
  logger.error(message);
}

module.exports = queryForRoles;