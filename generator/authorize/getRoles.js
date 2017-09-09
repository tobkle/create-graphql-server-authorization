'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRoles = getRoles;

var _constants = require('../../constants');

var _extractRoles = require('./extractRoles');

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

function getRoles(authorize, inputSchema) {
  // create empty userRoles and docRoles objects
  // as default values, which are used
  // if there is no @authorize directive
  var userRoles = {};
  var docRoles = {};
  var roleFieldNamesFound = [];

  // initialize
  _constants.CODE_MODES.forEach(function (mode) {
    return userRoles[mode] = [];
  });
  _constants.CODE_MODES.forEach(function (mode) {
    return docRoles[mode] = [];
  });

  // check if there is an @authorize directive
  if (authorize) {
    // then re-determine the userRoles and docRoles
    // from the @authorize tag of the type definition
    var allRolesArguments = inputSchema.definitions[0].directives[0].arguments || {};

    var allRoles = (0, _extractRoles.extractRoles)(allRolesArguments, inputSchema);

    allRoles.forEach(function (role) {
      switch (role.type) {
        case _constants.USER_ROLE:
          // check, if there is already another userRole field
          if (roleFieldNamesFound.length > 0 && role.roleFieldName !== '' && roleFieldNamesFound.indexOf(role.roleFieldName) < 0) {
            // We allow only one field, which stores all userRoles
            throw new Error('Please adjust type definition, that there is \n              only ONE field, which keeps all user roles. You\'ve tried to \n              add a second userRole field: \'' + role.roleFieldName + '\',\n              but there is already another userRole field: \n              \'' + roleFieldNamesFound[0] + '\' defined.\n              Please try instead: \'' + roleFieldNamesFound[0] + ': \n              String @authRole(for: ["otherRole", "' + role.roleName + '"])\'');
          }
          if (role.roleFieldName !== '') {
            roleFieldNamesFound.push(role.roleFieldName);
          }

          Object.keys(role.modes).forEach(function (mode) {
            if (role.modes[mode]) {
              userRoles[mode].push(role.roleName);
            }
          });
          break;

        case _constants.DOC_ROLE:
          Object.keys(role.modes).forEach(function (mode) {
            if (role.modes[mode]) {
              docRoles[mode].push(role.roleName);
            }
          });
          break;
      }
    });
  }

  return {
    userRoles: userRoles,
    docRoles: docRoles,
    roleFieldName: roleFieldNamesFound.length > 0 ? roleFieldNamesFound[0] : ''
  };
}