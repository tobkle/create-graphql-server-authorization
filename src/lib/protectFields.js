/*
 * Protects a field based on authorizations
 * @param {object} me
 * @param {array} authorizedUserRoles
 * @param {array} protectedFields
 * @param {object} inputObject
 * @param {object} User
 * @return {object} result
 */

export default function protectFields(
  me = {},
  authorizedUserRoles = [],
  protectedFields = [],
  inputObject = {},
  { User }
) {
  // pure function
  const result = Object.assign({}, inputObject);

  // getting role of current User
  const role = User.authRole(me);

  // if user is not allowed to access specific fields, remove field from object...
  if (!authorizedUserRoles.includes(role)) {
    protectedFields.forEach(protectedField => {
      if (result[protectedField]) delete result[protectedField];
    });
  }

  return result;
}
