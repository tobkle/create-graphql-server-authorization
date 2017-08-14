import { dummyUserContext } from './dummyUserContext';
import { authlog } from './authlog';

const defaultLogger = authlog();

/*
 * Is a user's role authorized for a document
 * @param {object} me
 * @param {array} userRoles
 * @param {object} User
 * @param {object} logger
 * @return {boolean} authorized
 */

// returns true, if the user's role is authorized for a document
export function userRoleAuthorized(
  me = {},
  userRoles = [],
  { User } = { User: dummyUserContext },
  logger = defaultLogger
) {
  // get current User's role
  const role = User.authRole(me);

  // determine, if the given userRoles authorize the current User by its role
  if (
    // userRole: 'world' should authorize everyone - known and unknown users
    userRoles.includes('world') ||
    // or there must be a userRole given, and current user must have a role
    // and the current user's role must be in the given userRoles
    (role && role !== '' && userRoles.length > 0 && userRoles.includes(role))
  ) {
    // => authorized
    logger.debug(`and role '${role ? role : '<no-role>'}' is authorized`);
    return true;
  }

  // => not authorized
  return false;
}
