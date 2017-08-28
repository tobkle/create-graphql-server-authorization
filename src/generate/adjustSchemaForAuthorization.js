// @flow

import { CREATE, READ, USER_LITERAL, USER_MODEL } from '../constants';
import { isAuthorizeDirectiveDefined } from './isAuthorizeDirectiveDefined';
/**
 * generate authorization related fields for schema of the type
 * @public
 * @param {string} typeName - name of the type
 * @param {object} inputSchema - schema of the type
 * @return {array} adjustments - fields to be added to the schema
 */

export function adjustSchemaForAuthorization(
  typeName: string = '',
  inputSchema: any
): Array<any> {
  const adjustments = [];
  const authorize = isAuthorizeDirectiveDefined(inputSchema);

  // only if authorization directive is defined for this type
  if (authorize) {
    // for type User: add field 'password' for mode 'create'
    if (typeName === USER_MODEL) {
      adjustments.push({
        mode: CREATE,
        name: 'password',
        type: 'String!'
      });
    }

    // for all typeNames with authorization: add 'createdBy'
    adjustments.push({
      mode: READ,
      name: 'createdBy',
      type: USER_LITERAL
    });

    // for all typeNames with authorization: add 'updatedBy'
    adjustments.push({
      mode: READ,
      name: 'updatedBy',
      type: USER_LITERAL
    });
  }

  // for all typeNames: add 'createdBy'
  adjustments.push({
    mode: READ,
    name: 'createdAt',
    type: 'Float!'
  });

  // for all typeNames: add 'updatedBy'
  adjustments.push({
    mode: READ,
    name: 'updatedAt',
    type: 'Float!'
  });

  return adjustments;
}
