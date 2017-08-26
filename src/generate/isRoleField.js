// @flow

import {
  DIRECTIVE,
  FOR,
  NAME,
  AUTH_ROLE,
  STRING_VALUE,
  LIST_VALUE
} from '../constants';

/*
 * is this field a roleField
 * check, if this field has the authRole directive
 * @private
 * @param {string} roleName - name of the role
 * @param {array} fieldDirectives  - AST with field directives
 * @return {boolean} isRoleField - true, if it is a field with a role
 */

export function isRoleField(roleName: string, fieldDirectives: any): boolean {
  let found = false;

  // loop over all field directives for an 'authRole'
  fieldDirectives.forEach(fieldDirective => {
    if (
      fieldDirective.kind &&
      fieldDirective.kind === DIRECTIVE &&
      fieldDirective.name &&
      fieldDirective.name.kind === NAME &&
      fieldDirective.name.value === AUTH_ROLE &&
      fieldDirective.arguments &&
      fieldDirective.arguments.length > 0
    ) {
      // loop over all arguments, if it is for our roleName
      // e.g. roleName: 'admin' find @authRole(for: ["admin"])
      fieldDirective.arguments.forEach(fieldDirectiveArgument => {
        // check, if there is a 'for'
        if (
          fieldDirectiveArgument.name &&
          fieldDirectiveArgument.name.kind &&
          fieldDirectiveArgument.name.kind === NAME &&
          fieldDirectiveArgument.name.value &&
          fieldDirectiveArgument.name.value === FOR &&
          fieldDirectiveArgument.value &&
          fieldDirectiveArgument.value.kind
        ) {
          // check, if it is a list value:
          if (
            fieldDirectiveArgument.value.kind === LIST_VALUE &&
            fieldDirectiveArgument.value.values &&
            fieldDirectiveArgument.value.values.length > 0
          ) {
            // loop over all values, if there is one with our roleName
            const fieldRoles = fieldDirectiveArgument.value.values;
            fieldRoles.forEach(fieldRole => {
              // check, if it is our roleName
              if (
                fieldRole.kind &&
                fieldRole.kind === STRING_VALUE &&
                fieldRole.value &&
                fieldRole.value !== '' &&
                fieldRole.value === roleName
              ) {
                // we found it!
                found = true;
              }
            });
            // check, if it is a single value:
          } else if (
            fieldDirectiveArgument.value.kind === STRING_VALUE &&
            fieldDirectiveArgument.value.value &&
            fieldDirectiveArgument.value.value !== '' &&
            fieldDirectiveArgument.value.value === roleName
          ) {
            // we found it!
            found = true;
          }
        }
      });
    }
  });
  return found;
}
