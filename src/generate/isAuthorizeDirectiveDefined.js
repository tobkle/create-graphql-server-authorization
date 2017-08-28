// @flow

import { AUTHORIZE_DIRECTIVE } from '../constants';

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
  return (
    inputSchema.definitions[0].directives[0].name.value ===
      AUTHORIZE_DIRECTIVE || false
  );
}
