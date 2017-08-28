// @flow

import { USER_LITERAL, USER_MODEL } from '../constants';

/**
 * generate updatedBy method
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {string} typeName - name of the type
 * @return {string} generatedCode - generated code to be injected
 */

export function generateAuthRoleDefinition(
  authorize: boolean = false,
  typeName: string = ''
): string {
  // default code
  let generatedCode = ``;

  // with @authorize directive: means there must be a User type
  if (authorize && typeName === USER_MODEL) {
    generatedCode = `
    this.authRole = ${USER_LITERAL}.authRole;`;
  }

  return generatedCode;
}
