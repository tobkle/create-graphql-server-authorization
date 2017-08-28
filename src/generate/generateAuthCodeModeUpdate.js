// @flow
/* eslint-disable max-len */

import { USER_LITERAL, USER_MODEL } from '../constants';
import { prep } from './prep';

/**
 * generate authorization code for mode update
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {string} typeName - name of the type
 * @param {array} userRoles - list of userRoles
 * @param {array} docRoles - list of docRoles
 * @param {string} roleFieldName - field name for the role
 * @return {string} generatedCode - generated code to be injected
 */

export function generateAuthCodeModeUpdate(
  authorize: boolean = false,
  typeName: string = '',
  userRoles?: Array<string> = [],
  docRoles?: Array<string> = [],
  roleFieldName?: string = ''
) {
  // default code
  let generatedCode = `const finalQuery = {...baseQuery};`;

  // with @authorize directive
  if (authorize) {
    if (typeName === USER_MODEL) {
      // protectFields only on the user type
      // if the fields are filled, than convert them to proper strings,
      // otherwise set them to null
      // take the first userRole into the protectFields
      // as a suggestion to the programmer,
      // assuming this is the most important role,
      // with higher authorization (see in README.md)

      const firstUserRole =
        userRoles.length > 0 && userRoles[0] ? `'${userRoles[0]}'` : ``;

      const roleField = roleFieldName ? `'${roleFieldName}'` : ``;

      generatedCode = `const authQuery = queryForRoles(me, ${prep(
        userRoles
      )}, ${prep(
        docRoles
      )}, { ${USER_LITERAL}: this.context.${USER_LITERAL} }, authlog(resolver, 'update', me));
      const finalQuery = {...baseQuery, ...authQuery};
      docToUpdate.$set = protectFields(me, [${firstUserRole}], [${roleField}], docToUpdate.$set, { ${USER_LITERAL}: this.context.${USER_LITERAL} });`;
    } else {
      // without protectFields
      generatedCode = `const authQuery = queryForRoles(me, ${prep(
        userRoles
      )}, ${prep(
        docRoles
      )}, { ${USER_LITERAL}: this.context.${USER_LITERAL} }, authlog(resolver, 'update', me));
      const finalQuery = {...baseQuery, ...authQuery};`;
    }
  }

  return generatedCode;
}
