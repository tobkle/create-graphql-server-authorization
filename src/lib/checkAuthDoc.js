// @flow
import { userRoleAuthorized } from './userRoleAuthorized';
import { fieldContainsUserId } from './fieldContainsUserId';
import { authlog } from './authlog';

const defaultLogger = authlog();

/*
 * @desc Returns an authorized document
 * @public
 * @param {object} doc - any document to be checked
 * @param {object} me - current user
 * @param {array} userRoles - list of userRoles
 * @param {array} docRoles - list of docRoles
 * @param {object} User - model context of type User
 * @param {function} logger - the logger function
 * @return {object} doc - returns the authorized document
 * @throws {Error} - throws on a missing authorization
 */

export function checkAuthDoc(
  doc: any = {},
  me: any = {},
  userRoles: Array<string> = [],
  docRoles: Array<string> = [],
  { User },
  logger: any = defaultLogger
): any {
  const resultDoc = Object.assign({}, doc);

  // get the User's role
  const role = User.authRole(me);

  // check if userRole entitles current user for this action
  if (userRoleAuthorized(me, userRoles, { User }, logger)) {
    logger.debug(`and role: '${role}' is authorized by userRole.`);
    return resultDoc;
  }

  // check if docRole entitles current user for this document and action
  let authorized = false;
  docRoles.every(field => {
    if (
      resultDoc[field] &&
      me._id &&
      fieldContainsUserId(resultDoc[field], me._id)
    ) {
      authorized = true;
    }
  });
  if (authorized) {
    logger.debug(`and role: '${role}' is authorized by docRole.`);
    return resultDoc;
  }

  // Not Authorized, throw exception in logger.error
  logger.error(`and role: '${role}' is not authorized.`);
}
