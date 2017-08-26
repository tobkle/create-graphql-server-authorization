// @flow

import { getRoleType } from './getRoleType';
import {
  ARGUMENT,
  NAME,
  LIST_VALUE,
  STRING_VALUE,
  MODES,
  CODE_MODES,
  READ,
  READ_ONE,
  READ_MANY
} from '../constants';

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
 */

export function extractRoles(
  allRolesArguments: any = [],
  inputSchema: any
): Array<any> {
  const allRoles = [];
  // get all Roles of the type's @authorize directives
  // e.g. 'admin', 'this'
  allRolesArguments.forEach(roleArgument => {
    // new role found
    const role = {};

    // check if it is a valid role
    if (
      roleArgument.kind === ARGUMENT &&
      roleArgument.name &&
      roleArgument.name.kind === NAME &&
      roleArgument.name.value &&
      roleArgument.name.value !== ''
    ) {
      // define the new role
      role.name = roleArgument.name.value;

      // determine, if it is a 'userRole' or 'docRole'
      const { roleType, roleName, roleFieldName } = getRoleType(
        role.name,
        inputSchema
      );
      role.type = roleType;
      role.roleName = roleName;
      role.roleFieldName = roleFieldName;

      // create a default object, necessary for missing modes
      role.modes = {};
      CODE_MODES.forEach(mode => (role.modes[mode] = ''));

      // check, if it is a list of values
      if (
        roleArgument.value.kind &&
        roleArgument.value.kind === LIST_VALUE &&
        roleArgument.value.values &&
        roleArgument.value.values.length > 0
      ) {
        // get all authorized modes of the role
        const roleModes = roleArgument.value.values;
        roleModes.forEach(mode => {
          // check, if it is a valid authorization mode
          // e.g. 'create', 'update', 'delete', etc.
          if (
            mode.kind &&
            mode.kind === STRING_VALUE &&
            mode.value &&
            MODES.indexOf(mode.value) >= 0
          ) {
            // it is a valid authorization mode:
            // e.g.   {
            //           name: 'admin',
            //           type: null,      // later: => 'userRole' || 'docRole'
            //           modes: {
            //            create: 'admin',
            //            readOne: 'admin',
            //            readMany: 'admin',
            //            update: 'admin',,
            //            delete: 'admin',
            //        }
            //            'create' = 'admin'
            // special case 'read' means both, 'readOne' and 'readMany'

            if (mode.value === READ) {
              role.modes[READ_ONE] = role.roleName;
              role.modes[READ_MANY] = role.roleName;
            } else {
              role.modes[mode.value] = role.roleName;
            }
          }
        });

        // check, if it is a simple string value:
      } else if (
        roleArgument.name.value.kind &&
        roleArgument.name.value.kind === STRING_VALUE &&
        roleArgument.name.value &&
        MODES.indexOf(roleArgument.name.value) >= 0
      ) {
        //                         'create' = 'admin'
        // special case 'read' means both, 'readOne' and 'readMany'
        if (roleArgument.name.value === READ) {
          role.modes[READ_ONE] = role.roleName;
          role.modes[READ_MANY] = role.roleName;
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
