// @flow

import { USER_MODEL } from '../constants';

/**
 * generate bcrypt definition, only for type User
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {string} typeName - name of the type
 * @return {string} generatedCode - generated code to be injected
 */

export function generateBcryptDefinition(
  authorize: boolean = false,
  typeName: string = ''
): string {
  // default code
  let generatedCode = ``;

  // with @authorize directive: means there must be a User type
  if (authorize && typeName === USER_MODEL) {
    generatedCode = `
    import bcrypt from 'bcrypt';
    const SALT_ROUNDS = 10;`;
  }

  return generatedCode;
}
