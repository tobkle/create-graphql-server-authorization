// @flow

import { dummyUserContext } from './dummyUserContext';

/**
 * Protects a field based on authorizations
 * @public
 * @param {object} me - current user
 * @param {array} authorizedUserRoles - userRoles with authorization
 * @param {array} protectedFields - list of fields only for these userRoles
 * @param {object} inputObject - document with might contain those fields
 * @param {object} User - model context for type User
 * @return {object} result - document with or without the protected fields
 */

export function protectFields(
  me: any = {},
  authorizedUserRoles: Array<string> = [],
  protectedFields: Array<string> = [],
  inputObject: any = {},
  { User } = { User: dummyUserContext }
): any {
  // pure function
  const result = Object.assign({}, inputObject);

  // getting role of current User
  const role = User.authRole(me);

  // if user is not allowed to access specific fields,
  // remove field from object...
  if (!authorizedUserRoles.includes(role)) {
    protectedFields.forEach(protectedField => {
      if (result[protectedField]) {
        delete result[protectedField];
      }
    });
  }

  return result;
}
