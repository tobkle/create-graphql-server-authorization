// @flow
/* eslint-disable max-len */

import type { templateContextType } from '../constants';
import { CREATE, USER_LITERAL, ROLE_FIELD_DEFAULT } from '../constants';
import { lcFirst, ucFirst, prep } from '../utilities';
import { getRoles } from './authorize/getRoles';
import { isAuthorizeDirectiveDefined } from './authorize/isAuthorizeDirectiveDefined';

/**
 * get context for later template compilation
 * reads schema and determines data context for code replacements
 * @public
 * @param {Object} inputSchema - schema of the type
 * @param {string} User - name of the user model for User model context
 * @return {Object} templateContext - data context for template compilation
 * @property {boolean} authorize - if authorization logic is there
 * @property {boolean} isUserType- if it is the User type
 * @property {string} typeName - name of the type with starting lower case
 * @property {string} TypeName - name of the type with starting upper case
 * @property {string} User - name of the user model
 * @property {Object} userRoles - authorizations matrix for userRole
 * @property {Object} docRoles - authorization matrix for docRole
 * @property {string} firstUserRole - the role for protectFields
 * @property {string} roleField - field name where the userRole is stored
 */

export function getContext(
  inputSchema: any = {},
  User: string = USER_LITERAL
): templateContextType {
  // prepare template context for later compilation
  const authorize = isAuthorizeDirectiveDefined(inputSchema);

  // read TypeName out of inputSchema
  const TypeName = ucFirst(inputSchema.definitions[0].name.value);
  const typeName = lcFirst(TypeName);
  const isUserType = TypeName === User;
  const { userRoles, docRoles, roleFieldName } = getRoles(
    authorize,
    inputSchema
  );

  // protectFields only on the user type
  // roleField shouldn't be empty out, otherwise syntax errors occurs
  // it checks, if the field is really there
  // take the first userRole into the protectFields as a suggestion
  // to the programmer, assuming this is the most important role,
  // with higher authorization (see in README.md)

  const firstUserRole = userRoles[CREATE][0] ? userRoles[CREATE][0] : ``;
  const roleField = roleFieldName
    ? `${roleFieldName}`
    : `${ROLE_FIELD_DEFAULT}`;

  Object.keys(userRoles).forEach(mode => {
    userRoles[mode] = prep(userRoles[mode]);
  });

  Object.keys(userRoles).forEach(mode => {
    docRoles[mode] = prep(docRoles[mode]);
  });

  return {
    authorize,
    isUserType,
    typeName,
    TypeName,
    User,
    userRoles,
    docRoles,
    firstUserRole,
    roleField
  };
}
