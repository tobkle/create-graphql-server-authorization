import userRoleAuthorized from "./userRoleAuthorized";
import fieldContainsUserId from "./fieldContainsUserId";
import logger from "./logger";

/**
 * Returns an authorized document
 * @param {string} resolver
 * @param {string} mode
 * @param {object} me
 * @return {
 *    debug {function},
 *    error {function} 
 * }
 */

export default function checkAuthDoc(
  doc,
  me,
  userRoles,
  docRoles,
  { User },
  logger
) {
  const role = User.authRole(me);

  // check if userRole entitles current user for this action
  if (userRoleAuthorized(me, userRoles, { User }, logger)) {
    logger.debug(`and role: "${role}" is authorized by userRole.`);
    return doc;
  }

  // check if docRole entitles current user for this document and action
  let authorized = false;
  docRoles.every(field => {
    if (fieldContainsUserId(doc[field], me._id)) {
      authorized = true;
    }
  });
  if (authorized) {
    logger.debug(`and role: "${role}" is authorized by docRole.`);
    return doc;
  }

  // Not Authorized
  logger.error(`and role: "${role}" is not authorized.`);
}
