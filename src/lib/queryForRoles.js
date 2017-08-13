import userRoleAuthorized from "./userRoleAuthorized";
import loggedIn from "./loggedIn";

import dummyUserContext from "../../test/dummyUserContext";
import authlog from "./authlog";

const defaultLogger = authlog();
let User = dummyUserContext;

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

export default function queryForRoles(
  me = {},
  userRoles = [],
  docRoles = [],
  { User } = { User: dummyUserContext },
  logger = defaultLogger
) {
  // on insufficient authorization data, it cannot be authorized, throws exception
  if (!User || !User.authRole || !me || (!userRoles && !docRoles))
    logger.error(` is not authorized, due to authorization data.`);

  // get current User's role
  const role = User.authRole(me);

  // Build query for the case: The logged in user's role is authorized
  if (userRoleAuthorized(me, userRoles, { User }, logger)) {
    return {}; // empty authQuery means, do operation with no access restrictions
  }

  // Build query for the case: The user is listed in any document field
  const query = { $or: [] };
  // makes only sense, if user is logged in - otherwise no userId
  if (loggedIn(me)) {
    // prepare selection criterias as "authQuery" object
    // for later mongodb "find(...baseQuery,  ...authQuery)"
    //                               ...  AND ...{ field1 OR field2}
    // which will be also considered during the database access
    // as an "$or: [ { field1: userId}, { field2: userId} ]"
    // with all document roles as fields for the later selection.
    // At least one of those fields must match the userId,
    // otherwise, whether no data found or not authorized to access data
    docRoles.forEach(docRole => query.$or.push({ [docRole]: me._id }));
    // return this authQuery only, if there was at least 1 field added
    // otherwise it will result in an unlimited access
    if (query.$or.length > 0) {
      // for easier debugging write into the authorzation logs
      logger.debug(
        `and role: "${role ? role : "<no-role>"}" with 
        authQuery: ${JSON.stringify(query, null, 2)}`
      );
      // return the query as authQuery for later selection
      return query;
    }
  }

  // Not Authorized - throw exception in logger.error
  const message = `and role: "${role}" is not authorized.`;
  logger.error(message);
}
