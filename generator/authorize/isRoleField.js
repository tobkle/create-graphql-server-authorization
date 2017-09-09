'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRoleField = isRoleField;

var _constants = require('../../constants');

/*
 * is this field a roleField
 * check, if this field has the authRole directive
 * @private
 * @param {string} roleName - name of the role
 * @param {array} fieldDirectives  - AST with field directives
 * @return {boolean} isRoleField - true, if it is a field with a role
 */

function isRoleField(roleName, fieldDirectives) {
  var found = false;

  // loop over all field directives for an 'authRole'
  fieldDirectives.forEach(function (fieldDirective) {
    if (fieldDirective.kind === _constants.DIRECTIVE && fieldDirective.name.kind === _constants.NAME && fieldDirective.name.value === _constants.AUTH_ROLE && fieldDirective.arguments.length > 0) {
      // loop over all arguments, if it is for our roleName
      // e.g. roleName: 'admin' find @authRole(for: ["admin"])
      fieldDirective.arguments.forEach(function (fieldDirectiveArgument) {
        // check, if there is a 'for'
        if (fieldDirectiveArgument.name.kind === _constants.NAME && fieldDirectiveArgument.name.value === _constants.FOR) {
          // check, if it is a list value:
          if (fieldDirectiveArgument.value.kind === _constants.LIST && fieldDirectiveArgument.value.values.length > 0) {
            // loop over all values, if there is one with our roleName
            var fieldRoles = fieldDirectiveArgument.value.values;
            fieldRoles.forEach(function (fieldRole) {
              // check, if it is our roleName
              if (fieldRole.kind === _constants.STRING && fieldRole.value === roleName) {
                // we found it!
                found = true;
              }
            });

            // check, if it is a single value:
          } else if (fieldDirectiveArgument.value.kind === _constants.STRING && fieldDirectiveArgument.value.value === roleName) {
            // we found it!
            found = true;
          }
        }
      });
    }
  });
  return found;
}