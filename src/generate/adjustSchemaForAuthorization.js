// @flow

import { CREATE, READ, USER, USER_MODEL } from '../constants';
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
    switch (typeName) {
      case USER_MODEL:
        // for type User: add field 'password' only for mode 'create'
        adjustments.push({
          mode: CREATE,
          name: 'password',
          type: 'String!'
        });
        break;
    }

    // for all typeNames: add 'createdBy' and 'updatedBy' fields
    adjustments.push({
      mode: READ,
      name: 'createdBy',
      type: USER
    });

    adjustments.push({
      mode: READ,
      name: 'updatedBy',
      type: USER
    });
  }

  // for all typeNames: add 'createdBy' and 'updatedBy' fields
  adjustments.push({
    mode: READ,
    name: 'createdAt',
    type: 'Float!'
  });

  adjustments.push({
    mode: READ,
    name: 'updatedAt',
    type: 'Float!'
  });

  return adjustments;
}
