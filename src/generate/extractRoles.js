// @flow

import {
  ARGUMENT,
  NAME,
  LIST,
  STRING,
  MODES,
  CODE_MODES,
  READ,
  READ_ONE,
  READ_MANY
} from '../constants';

import { getRoleType } from './getRoleType';

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

export function extractRoles(
  allRolesArguments: any = [],
  inputSchema: any
): Array<any> {
  const allRoles = [];

  // get all Roles of the type's @authorize directives
  // e.g. 'admin', 'this'
  allRolesArguments.forEach(roleArgument => {

    const role = {};

    // check if it is a valid role
    if (roleArgument.kind === ARGUMENT && roleArgument.name.kind === NAME) {

      role.name = roleArgument.name.value;

      // determine the role type, ==> 'userRole' || 'docRole'
      const { roleType, roleName, roleFieldName } = getRoleType(
        role.name,
        inputSchema
      );
      role.type = roleType;
      role.roleName = roleName;
      role.roleFieldName = roleFieldName;

      // create and initialize default 'modes' object
      role.modes = {};
      CODE_MODES.forEach(mode => (role.modes[mode] = ''));

      // LIST? e.g. ['create', 'update', 'delete']
      if (roleArgument.value.kind === LIST) {

        // get all authorized modes for that role
        const roleModes = roleArgument.value.values;

        roleModes.forEach(mode => {

          // check, if it is a valid authorization mode
          // e.g. 'create', 'update', 'delete', etc.
          if (mode.kind === STRING && MODES.indexOf(mode.value) >= 0) {

            // special case 'read' means both, 'readOne' and 'readMany'
            if (mode.value === READ) {
              role.modes[READ_ONE] = role.roleName;
              role.modes[READ_MANY] = role.roleName;

            // all other modes
            } else {
              role.modes[mode.value] = role.roleName;
            }

          }
        });

      // STRING? e.g. 'create'
      } else if (roleArgument.name.value.kind === STRING &&
        MODES.indexOf(roleArgument.name.value) >= 0) {

        // special case 'read' means both, 'readOne' and 'readMany'
        if (roleArgument.name.value === READ) {
          role.modes[READ_ONE] = role.roleName;
          role.modes[READ_MANY] = role.roleName;

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
