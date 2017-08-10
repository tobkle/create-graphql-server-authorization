/**
 * Is a user's role authorized for a document
 * @param {object} me
 * @param {array} userRoles
 * @param {object} User
 * @param {object} logger
 * @return {boolean} authorized
 */

// returns true, if the user's role is authorized for a document
export default function userRoleAuthorized(
  me = {},
  userRoles = [],
  { User },
  logger
) {
  const role = User.authRole(me);

  if (
    userRoles.includes("world") ||
    (role && userRoles.length > 0 && userRoles.includes(role))
  ) {
    logger.debug(`and role "${role ? role : "<no-role>"}" is authorized`);
    return true;
  }

  return false;
}
