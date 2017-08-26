// @flow

import {
  USER_ROLE,
  DOC_ROLE,
  THIS,
  FIELD_DEFINITION,
  NAME,
  STRING,
  USER,
  LIST_OF_STRINGS,
  LIST_OF_USERS,
  ID_FIELD,
  ID_SINGULAR,
  ID_PLURAL
} from '../constants';
import { isRoleField } from './isRoleField';
import { getFieldType } from './getFieldType';

/**
 * decide, if the given role is whether 
 * a 'userRole' or a 'docRole'
 *
 * Procedure:
 * 1. Determine, if this field is used as a roleField
 * 2. Check, if this roleField...
 *    a) is of type: String or [String] ==> userRole
 *    b) is of type: User or [User]     ==> docRole
 *    c) roleName = 'this'              ==> docRole
 * 3. If there is no roleField in this type
 *    it must be a userRole
 * 
 * For 1. is a roleField:
 *   read the type's abstract syntax tree
 *   loop over all provided fields,
 *   check, if the field has a directive '@authRole'
 *   and if this authRole is 'for' the provided 'roleName'
 *   or the roleName is the special case 'this'
 *   ==> then it is a roleField
 *
 * For 2. get it's fieldType:
 *   read the type's abstract syntax tree
 *   for the roleField and read it's type
 *   
 *   a) if it is a String or List of Strings,
 *   then the roleType = 'userRole'
 *
 *   b) if it is a User or List of Users (userIds),
 *   then the roleType = 'docType'
 *
 *   c) special case: roleName = 'this'
 *   (it doesn't look for an authRole for 'this')
 *   it means the document's id field is used for this
 *   meaning the role defines the authorizations,
 *   a User has upon his own User document
 *
 * For 3. none of the above applies
 *   so the role must be a userRole
 *   
 * @private
 * @param {string} name - name of the role
 * @param {object} inputSchema - the schema of the type
 * @return {Object} role - role definitions
 * @property {string} roleType - type of the role 'userRole', 'docRole'
 * @property {string} roleName - name of the role
 * @property {string} roleFieldName - field name for the userRole
 */

export function getRoleType(name: string = '', inputSchema: any = {}): any {
  // all field definitions of the type
  const allFields = inputSchema.definitions[0].fields;
  let roleType = null;
  let roleName = '';
  let roleFieldName = '';

  // special case 'this'
  if (name === THIS) {
    return {
      roleType: DOC_ROLE,
      roleName: ID_FIELD,
      roleFieldName: ID_FIELD
    };
  }

  // loop over all fields to find authRole directive
  allFields.forEach(field => {
    if (
      field.kind &&
      field.kind === FIELD_DEFINITION &&
      field.name &&
      field.name.kind &&
      field.name.kind === NAME &&
      field.name.value &&
      field.directives &&
      field.directives.length > 0
    ) {
      // 1. check, if it is a roleField
      if (isRoleField(name, field.directives)) {
        // 2. get the type of the field
        const fieldType = getFieldType(field);
        // determine the roleType: 'userRole' || 'docRole'
        // and the roleName for...
        // userRoles: 'admin', 'user',...
        // docRoles: 'authorId', 'coAuthorsIds',...
        switch (fieldType) {
          case STRING:
            // a) userRole
            roleType = USER_ROLE;
            roleName = name;
            roleFieldName = field.name.value;
            break;

          case LIST_OF_STRINGS:
            // a) userRole
            roleType = USER_ROLE;
            roleName = name;
            roleFieldName = field.name.value;
            break;

          case USER:
            // b) docRole
            roleType = DOC_ROLE;
            roleName = `${field.name.value}${ID_SINGULAR}`;
            roleFieldName = field.name.value;
            break;

          case LIST_OF_USERS:
            // b) docRole
            roleType = DOC_ROLE;
            roleName = `${field.name.value}${ID_PLURAL}`;
            roleFieldName = field.name.value;
            break;
        }
      }
    }
  });

  if (roleType) {
    // 2. a) userRole or b) docRole applies
    return {
      roleType,
      roleName,
      roleFieldName
    };
  } else if (name !== '') {
    // 3. none of the above applies, so it must be a userRole
    return {
      roleType: USER_ROLE,
      roleName: name,
      roleFieldName: ''
    };
  }
}
