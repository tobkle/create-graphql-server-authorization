/* eslint-disable max-len */
// @flow

import { userRoleAuthorized } from './userRoleAuthorized';
import { dummyUserContext } from './dummyUserContext';
import { loggedIn } from './loggedIn';
import { authlog } from './authlog';

const defaultLogger = authlog();

/*
 * @desc Prepare a query object for mongodb operations with authorization queries
 * @desc creates an authQuery object with additional 
 * @desc query arguments, to implement authorization restrictions for mongodb access
 * @public
 * @param {object} me - current user
 * @param {array} userRoles - list of userRoles
 * @param {array} docRoles - list of docRoles
 * @param {object} inputObject - document
 * @param {object} User - model context for type User
 * @param {object} logger - logger function
 * @return {object, exception} queryObject - authQuery for data operations
 *
 * @example: queryForRoles(me, userRoles, docRoles, { User }, 
 *                         authlog(resolver, mode, me ) ); 
 */
export function queryForRoles(
  me: any = {},
  userRoles: Array<string> = [],
  docRoles: Array<string> = [],
  { User } = { User: dummyUserContext },
  logger: any = defaultLogger
): any {
  // get current User's role
  const role = User.authRole(me);

  // Build query for the case: The logged in user's role is authorized
  if (userRoleAuthorized(me, userRoles, { User }, logger)) {
    // empty authQuery means, do operation with no access restrictions
    return {};
  }

  // Build query for the case: The user is listed in any document field
  const query = { $or: [] };
  // makes only sense, if user is logged in - otherwise no userId
  if (loggedIn(me)) {
    // prepare selection criterias as 'authQuery' object
    // for later mongodb 'find(...baseQuery,  ...authQuery)'
    //                               ...  AND ...{ field1 OR field2}
    // which will be also considered during the database access
    // as an '$or: [ { field1: userId}, { field2: userId} ]'
    // with all document roles as fields for the later selection.
    // At least one of those fields must match the userId,
    // otherwise, whether no data found or not authorized to access data
    docRoles.forEach(docRole => query.$or.push({ [docRole]: me._id }));
    // return this authQuery only, if there was at least 1 field added
    // otherwise it will result in an unlimited access
    if (query.$or.length > 0) {
      // for easier debugging write into the authorzation logs
      logger.debug(
        `and role: '${role ? role : '<no-role>'}' with 
        authQuery: ${JSON.stringify(query, null, 2)}`
      );
      // return the query as authQuery for later selection
      return query;
    }
  }

  // Not Authorized - throw exception in logger.error
  const message = `and role: '${role}' is not authorized.`;
  logger.error(message);
}
