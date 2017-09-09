'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractRoles = extractRoles;

var _constants = require('../../constants');

var _getRoleType2 = require('./getRoleType');

/**
 * extract the roles from the @authorize directive
 * by reading the input schema's abstract syntax tree
 * to get the roles and their authorized modes
 * @private
 * @param {object} allRolesArguments - AST with role definitions
 * @param {object} inputSchema - the schema of the type
 * @return {array} allRoles - returns the defined roles
 * @example 
 *          @authorize(
 *            admin: ["create", "read", "update", "delete"]
 *            this: ["read", "update", "delete"]
 *          )
 *
 * it creates the following array (example):
 *
 * allRoles = [
 *       {
 *           name: 'admin',
 *           type: 'userRole' || 'docRole'
 *           modes: {
 *            create: 'admin',
 *            readOne: 'admin',
 *            readMany: 'admin',
 *            update: 'admin',,
 *            delete: 'admin',
 *        }
 * ]
 */

function extractRoles() {
  var allRolesArguments = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var inputSchema = arguments[1];

  var allRoles = [];

  // get all Roles of the type's @authorize directives
  // e.g. 'admin', 'this'
  allRolesArguments.forEach(function (roleArgument) {
    var role = {};

    // check if it is a valid role
    if (roleArgument.kind === _constants.ARGUMENT && roleArgument.name.kind === _constants.NAME) {
      role.name = roleArgument.name.value;

      // determine the role type, ==> 'userRole' || 'docRole'

      var _getRoleType = (0, _getRoleType2.getRoleType)(role.name, inputSchema),
          roleType = _getRoleType.roleType,
          roleName = _getRoleType.roleName,
          roleFieldName = _getRoleType.roleFieldName;

      role.type = roleType;
      role.roleName = roleName;
      role.roleFieldName = roleFieldName;

      // create and initialize default 'modes' object
      role.modes = {};
      _constants.CODE_MODES.forEach(function (mode) {
        return role.modes[mode] = '';
      });

      // LIST? e.g. ['create', 'update', 'delete']
      if (roleArgument.value.kind === _constants.LIST) {
        // get all authorized modes for that role
        var roleModes = roleArgument.value.values;

        roleModes.forEach(function (mode) {
          // check, if it is a valid authorization mode
          // e.g. 'create', 'update', 'delete', etc.
          if (mode.kind === _constants.STRING && _constants.MODES.indexOf(mode.value) >= 0) {
            // special case 'read' means both, 'readOne' and 'readMany'
            if (mode.value === _constants.READ) {
              role.modes[_constants.READ_ONE] = role.roleName;
              role.modes[_constants.READ_MANY] = role.roleName;

              // all other modes
            } else {
              role.modes[mode.value] = role.roleName;
            }
          }
        });

        // STRING? e.g. 'create'
      } else if (roleArgument.name.value.kind === _constants.STRING && _constants.MODES.indexOf(roleArgument.name.value) >= 0) {
        // special case 'read' means both, 'readOne' and 'readMany'
        if (roleArgument.name.value === _constants.READ) {
          role.modes[_constants.READ_ONE] = role.roleName;
          role.modes[_constants.READ_MANY] = role.roleName;

          // for all other modes
        } else {
          role.modes[roleArgument.name.value] = role.roleName;
        }
      }

      // add it to the list of roles
      allRoles.push(role);
    }
  });

  return allRoles;
}