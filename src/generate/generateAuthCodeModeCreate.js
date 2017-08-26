// @flow
/* eslint-disable max-len */

import { USER, USER_MODEL } from '../constants';
import { prep } from './prep';

/**
 * generate authorization code for mode create
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {string} typeName - name of the type
 * @param {array} userRoles - list of userRoles
 * @param {array} docRoles - list of docRoles
 * @param {string} roleFieldName - field name for the role
 * @return {string} generatedCode - generated code to be injected
 */

export function generateAuthCodeModeCreate(
  authorize: boolean = false,
  typeName: string = '',
  userRoles: Array<string> = [],
  docRoles: Array<string> = [],
  roleFieldName?: string = ''
) {
  // default code
  let generatedCode = ``;

  // with @authorize directive
  if (authorize) {
    if (typeName === USER_MODEL) {
      // protectFields only on the user type
      // if the fields are filled, than convert them to proper strings,
      // otherwise set them to null
      // take the first userRole into the protectFields as a suggestion
      // to the programmer, assuming this is the most important role,
      // with higher authorization (see in README.md)

      const firstUserRole =
        userRoles.length > 0 && userRoles[0] ? `'${userRoles[0]}'` : ``;

      const roleField = roleFieldName ? `'${roleFieldName}'` : ``;

      generatedCode = `checkAuthDoc(docToInsert, me, ${prep(userRoles)}, ${prep(
        docRoles
      )}, { ${USER}: this.context.${USER} }, authlog(resolver, 'create', me));
      docToInsert = protectFields(me, [${firstUserRole}], [${roleField}], docToInsert, { ${USER}: this.context.${USER} });`;
    } else {
      // without protectFields
      generatedCode = `checkAuthDoc(docToInsert, me, ${prep(userRoles)}, ${prep(
        docRoles
      )}, { ${USER}: this.context.${USER} }, authlog(resolver, 'create', me));`;
    }
  }

  return generatedCode;
}