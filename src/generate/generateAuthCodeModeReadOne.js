// @flow
/* eslint-disable max-len */

import { USER, USER_MODEL } from '../constants';
import { prep } from './prep';

/**
 * generate authorization code for mode readOne
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {string} typeName - name of the type
 * @param {string} userRoles - list of userRoles
 * @param {string} docRoles - list of docRoles
 * @return {string} generatedCode - generated code to be injected
 */

export function generateAuthCodeModeReadOne(
  authorize: boolean = false,
  typeName: string = '',
  userRoles: Array<string> = [],
  docRoles: Array<string> = []
): string {
  // default code
  let generatedCode = `const { me } = context;
    that.authorizedLoader = new DataLoader(ids => findByIds(this.collection, ids))`;

  // with @authorize directive
  if (authorize) {
    if (typeName === USER_MODEL) {
      // User has to come from current class context
      generatedCode = `const { me } = context;
      const authQuery = queryForRoles(me, ${prep(userRoles)}, ${prep(
        docRoles
      )}, { ${USER} }, authlog('${typeName} findOneById', 'readOne', me));
      that.authorizedLoader = new DataLoader(ids => findByIds(this.collection, ids, authQuery));`;
    } else {
      // User has to come from this.context.${USER}
      generatedCode = `const { me, ${USER} } = context;
      const authQuery = queryForRoles(me, ${prep(userRoles)}, ${prep(
        docRoles
      )}, { ${USER} }, authlog('${typeName} findOneById', 'readOne', me));
      that.authorizedLoader = new DataLoader(ids => findByIds(this.collection, ids, authQuery));`;
    }
  }

  return generatedCode;
}
