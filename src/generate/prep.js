// @flow
/* eslint-disable max-len */

/**
 * prepare roles for code generator
 * convert array to String value
 * replace " by '
 * @private
 * @param {array} role - name of role
 * @return {string} roleString - role string
 */

export function prep(role: any): string {
  return JSON.stringify(role).replace(/"/g, "'");
}
