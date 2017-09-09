'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRoleType = getRoleType;

var _constants = require('../../constants');

var _isRoleField = require('./isRoleField');

var _getFieldType = require('./getFieldType');

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

function getRoleType() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var inputSchema = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // all field definitions of the type
  var allFields = inputSchema.definitions[0].fields;
  var roleType = null;
  var roleName = '';
  var roleFieldName = '';

  // special case 'this'
  if (name === _constants.THIS) {
    return {
      roleType: _constants.DOC_ROLE,
      roleName: _constants.ID_FIELD,
      roleFieldName: _constants.ID_FIELD
    };
  }

  // loop over all fields to find authRole directive
  allFields.forEach(function (field) {
    if (field.kind === _constants.FIELD_DEFINITION && field.name.kind === _constants.NAME && field.directives.length > 0) {
      // 1. check, if it is a roleField
      if ((0, _isRoleField.isRoleField)(name, field.directives)) {
        // 2. get the type of the field
        var fieldType = (0, _getFieldType.getFieldType)(field);

        // determine the roleType: 'userRole' || 'docRole'
        // and the roleName for...
        // userRoles: 'admin', 'user',...
        // docRoles: 'authorId', 'coAuthorsIds',...
        switch (fieldType) {
          case _constants.STRING_LITERAL:
            // ==> a) userRole
            roleType = _constants.USER_ROLE;
            roleName = name;
            roleFieldName = field.name.value;
            break;

          case _constants.STRING_LIST:
            // ==> a) userRole
            roleType = _constants.USER_ROLE;
            roleName = name;
            roleFieldName = field.name.value;
            break;

          case _constants.USER_LITERAL:
            // ==> b) docRole
            roleType = _constants.DOC_ROLE;
            roleName = '' + field.name.value + _constants.ID_SINGULAR;
            roleFieldName = field.name.value;
            break;

          case _constants.USER_LIST:
            // ==> b) docRole
            roleType = _constants.DOC_ROLE;
            roleName = '' + field.name.value + _constants.ID_PLURAL;
            roleFieldName = field.name.value;
            break;
        }
      }
    }
  });

  if (roleType) {
    // 2. a) userRole or b) docRole applies
    return {
      roleType: roleType,
      roleName: roleName,
      roleFieldName: roleFieldName
    };
  } else if (name !== '') {
    // 3. none of the above, so it must be a userRole
    return {
      roleType: _constants.USER_ROLE,
      roleName: name,
      roleFieldName: ''
    };
  }
}