// @flow
/* eslint-disable max-len */

import { USER_MODEL } from '../constants';

/**
 * generate authRole() method only in type User
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {string} typeName - name of the type
 * @param {string} roleFieldName - field name, where userRole is stored on type User
 * @return {string} generatedCode - generated code to be injected
 */

export function generateAuthRoleMethod(
  authorize: boolean = false,
  typeName: string = '',
  roleFieldName: string = ''
): string {
  // default code
  let generatedCode = ``;

  // with @authorize directive: means there must be a User type
  if (authorize && roleFieldName !== '' && typeName === USER_MODEL) {
    generatedCode = `
  static authRole(${typeName}){
    return (${typeName} && ${typeName}.${roleFieldName}) ? ${typeName}.${roleFieldName} : null;
  }
  `;
  }

  return generatedCode;
}
