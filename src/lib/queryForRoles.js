import userRoleAuthorized from "./userRoleAuthorized";
import loggedIn from "./loggedIn";
import logger from "./logger";

/**
 * Prepare a query object for mongodb operations with authorization queries
 * creates an authQuery object with additional query arguments, to implement authorization restrictions for mongodb access
 * @param {object} me
 * @param {array} userRoles
 * @param {array} docRoles
 * @param {object} inputObject
 * @param {object} User
 * @param {object} logger
 * @return {object} queryObject
 */

export default function queryForRoles(
  me = {},
  userRoles = [],
  docRoles = [],
  { User },
  logger
) {
  const role = User.authRole(me);

  // Build query for the case: The logged in user's role is authorized
  if (userRoleAuthorized(me, userRoles, { User }, logger)) {
    return {}; // empty authQuery means, do operation with no access restrictions
  }

  // Build query for the case: The user is listed in any document field
  const query = { $or: [] };
  if (loggedIn(me)) {
    docRoles.forEach(docRole => query.$or.push({ [docRole]: me._id }));
    logger.debug(
      `and role: "${role
        ? role
        : "<no-role>"}" with \nauthQuery: ${JSON.stringify(query, null, 2)}`
    );
    if (query.$or.length > 0) return query;
  }

  // Not Authorized
  const message = `and role: "${role}" is not authorized.`;
  logger.error(message);
}
