import userRoleAuthorized from "./userRoleAuthorized";
import fieldContainsUserId from "./fieldContainsUserId";
import authlog from "./authlog";

const defaultLogger = authlog();

/*
 * Returns an authorized document
 * @param {object} doc
 * @param {object} me
 * @param {array} userRoles
 * @param {array} docRoles
 * @param {object} User
 * @param {function} logger
 * @return {object} doc
 */

function checkAuthDoc(
  doc = {},
  me = {},
  userRoles = [],
  docRoles = [],
  { User },
  logger = defaultLogger
) {
  let resultDoc = Object.assign({}, doc);

  // get the User's role
  const role = User.authRole(me);

  // check if userRole entitles current user for this action
  if (userRoleAuthorized(me, userRoles, { User }, logger)) {
    logger.debug(`and role: "${role}" is authorized by userRole.`);
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
    logger.debug(`and role: "${role}" is authorized by docRole.`);
    return resultDoc;
  }

  // Not Authorized, throw exception in logger.error
  logger.error(`and role: "${role}" is not authorized.`);
}

module.exports = checkAuthDoc;
