// @flow

import {
  OBJECT_TYPE_DEFINITION,
  AUTHORIZE_DIRECTIVE
} from '../../constants';

/**
 * checks, if there is authorization logic defined
 * true, if there is an @authorize directive in the header 
 * in the type's inputSchema
 * if there is an @authorize directive => true
 * if thers is no @authorize directive => false
 * @public
 * @param {object} inputSchema - schema for the type
 * @return {boolean} authorized - true, if authorization logic defined
 */

export function isAuthorizeDirectiveDefined(inputSchema: any): boolean {
  let authorize = false;

  inputSchema.definitions
    .filter(def => def.kind === OBJECT_TYPE_DEFINITION)
    .some(def => {
      def.directives.some(directive => {
        if (directive.name.value === AUTHORIZE_DIRECTIVE) {
          authorize = true;
        }
      })
    })

  return authorize;
}
