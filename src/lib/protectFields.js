/**
 * Protects a field based on authorizations
 * @param {object} me
 * @param {array} authorizedUserRoles
 * @param {array} protectedFields
 * @param {object} inputObject
 * @param {object} User
 * @return {object} result
 */

export default function protectFields(
  me,
  authorizedUserRoles,
  protectedFields,
  inputObject,
  { User }
) {
  const result = Object.assign({}, inputObject);
  const role = User.authRole(me);
  // if user is not allowed to access specific fields, remove field from object...
  if (!authorizedUserRoles.includes(role)) {
    protectedFields.every(protectedField => {
      if (result[protectedField]) delete result[protectedField];
    });
  }
  return result;
}
