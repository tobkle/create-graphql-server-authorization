// @flow
/* eslint-disable max-len */

import { USER_LITERAL } from '../constants';
import { prep } from './prep';

/**
 * generate authorization code for mode delete
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {string} userRoles - list of userRoles
 * @param {string} docRoles - list of docRoles
 * @return {string} generatedCode - generated code to be injected
 */

export function generateAuthCodeModeDelete(
  authorize: boolean = false,
  userRoles?: Array<string> = [],
  docRoles?: Array<string> = []
) {
  // default code
  let generatedCode = `const finalQuery = {...baseQuery};`;

  // with @authorize directive
  if (authorize) {
    generatedCode = `const authQuery = queryForRoles(me, ${prep(
      userRoles
    )}, ${prep(
      docRoles
    )}, { ${USER_LITERAL}: this.context.${USER_LITERAL} }, authlog(resolver, 'delete', me));
      const finalQuery = {...baseQuery, ...authQuery};`;
  }

  return generatedCode;
}
