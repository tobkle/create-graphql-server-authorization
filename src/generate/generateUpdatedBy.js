// @flow
/* eslint-disable max-len */

import { USER } from '../constants';

/**
 * generate updatedBy method
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {string} typeName - name of the type
 * @return {string} generatedCode - generated code to be injected
 */

export function generateUpdatedBy(
  authorize: boolean = false,
  typeName: string = ''
): string {
  // default code
  let generatedCode = ``;

  // with @authorize directive: means there must be a User type
  if (authorize) {
    generatedCode = `updatedBy(${typeName}, me, resolver) {
    return this.context.${USER}.findOneById(${typeName}.updatedById, me, resolver);
  }`;
  }

  return generatedCode;
}
