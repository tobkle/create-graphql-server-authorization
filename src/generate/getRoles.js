// @flow

import { CODE_MODES, USER_ROLE, DOC_ROLE } from '../constants';
import { extractRoles } from './extractRoles';

/**
 * get userRoles and docRoles
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {object} inputSchema - type's schema
 * @return {Object}
 * @property {object} userRoles - userRoles object with modes
 * @property {object} docRoles - docRoles object with modes
 * @property {string} roleFieldName - field containing the roles
 * }
 */

export function getRoles(authorize: boolean, inputSchema: any) {
  // create empty userRoles and docRoles objects
  // as default values, which are used
  // if there is no @authorize directive
  const userRoles = {};
  const docRoles = {};
  const roleFieldNamesFound = [];

  // initialize
  CODE_MODES.forEach(mode => (userRoles[mode] = []));
  CODE_MODES.forEach(mode => (docRoles[mode] = []));

  // check if there is an @authorize directive
  if (authorize) {
    // then re-determine the userRoles and docRoles
    // from the @authorize tag of the type definition
    const allRolesArguments =
      inputSchema.definitions[0].directives[0].arguments || {};

    const allRoles = extractRoles(allRolesArguments, inputSchema);

    allRoles.forEach(role => {
      switch (role.type) {
        case USER_ROLE:
          // check, if there is already another userRole field
          if (
            roleFieldNamesFound.length > 0 &&
            role.roleFieldName !== '' &&
            roleFieldNamesFound.indexOf(role.roleFieldName) < 0
          ) {
            // We allow only one field, which stores all userRoles
            throw new Error(`Please adjust type definition, that there is 
              only ONE field, which keeps all user roles. You've tried to 
              add a second userRole field: '${role.roleFieldName}',
              but there is already another userRole field: 
              '${roleFieldNamesFound[0]}' defined.
              Please try instead: '${roleFieldNamesFound[0]}: 
              String @authRole(for: ["otherRole", "${role.roleName}"])'`);
          }
          if (role.roleFieldName !== '') {
            roleFieldNamesFound.push(role.roleFieldName);
          }

          Object.keys(role.modes).forEach(mode => {
            if (role.modes[mode]) {
              userRoles[mode].push(role.roleName);
            }
          });
          break;

        case DOC_ROLE:
          Object.keys(role.modes).forEach(mode => {
            if (role.modes[mode]) {
              docRoles[mode].push(role.roleName);
            }
          });
          break;
      }
    });
  }

  return {
    userRoles,
    docRoles,
    roleFieldName: roleFieldNamesFound.length > 0 ? roleFieldNamesFound[0] : ''
  };
}
