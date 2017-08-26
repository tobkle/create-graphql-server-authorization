// @flow

import { dummyUserContext } from './dummyUserContext';
import { authlog } from './authlog';

const defaultLogger = authlog();

/*
 * @desc Is a user's role authorized for a document
 * @desc You can use also the role 'world', to authorize everyone
 * @public
 * @param {object} me - current user
 * @param {array} userRoles - list of userRoles
 * @param {object} User - model context for type User
 * @param {object} logger - logger function
 * @return {boolean} authorized - true, if userRole is authorized
 */

export function userRoleAuthorized(
  me: any = {},
  userRoles: Array<string> = [],
  { User } = { User: dummyUserContext },
  logger: any = defaultLogger
): boolean {
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
