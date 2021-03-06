/* eslint-disable max-len */

/*
 * @desc create-graphql-server-authorization
 * @desc provides access to all public functions
 * @public
 * @param {function} dummyUserContext - get user.role
 * @param {function} authlog - how to log
 * @param {function} onAuthRegisterLoader - registers dataloader on successfull authorization
 * @param {function} checkAuthDoc - checks, if authorized for document
 * @param {function} fieldContainsUserId - checks, if field contains user id
 * @param {function} loggedIn - checks, if user logged in
 * @param {function} protectFields - protects fields for authorized users
 * @param {function} queryForRoles - creates authQuery for later data operations
 * @param {function} userRoleAuthorized - checks, if a user's role is authorized
 * @param {function} getCode - generates authorization code for models and resolvers during add-type
 * @param {function} getContext - required for getCode
 * @param {function} getName - required for getCode
 * @param {function} getPartials - required for getCode
 * @param {function} isAuthorizeDirectiveDefined - returns true, if authorization logic is defined
 * @param {function} enhanceSchemaForAuthorization - enhances the schema for authorization
 */

/* to find this path from various places, return this modules absolute path: */
export const modulePath = __dirname;

/* for the authorization logic */
export { dummyUserContext } from './lib/dummyUserContext.js';
export { authlog } from './lib/authlog.js';
export { onAuthRegisterLoader } from './lib/onAuthRegisterLoader.js';
export { checkAuthDoc } from './lib/checkAuthDoc.js';
export { fieldContainsUserId } from './lib/fieldContainsUserId.js';
export { loggedIn } from './lib/loggedIn.js';
export { protectFields } from './lib/protectFields.js';
export { queryForRoles } from './lib/queryForRoles.js';
export { userRoleAuthorized } from './lib/userRoleAuthorized.js';

/* for the code generator */
export { getCode } from './generator/getCode.js';
export { getContext } from './generator/getContext.js';
export { getName } from './generator/getName.js';
export { getPartials } from './generator/getPartials.js';

export { getRoles } from './generator/authorize/getRoles';

export {
  isAuthorizeDirectiveDefined
} from './generator/authorize/isAuthorizeDirectiveDefined.js';

export {
  enhanceSchemaForAuthorization
} from './generator/schema/enhanceSchemaForAuthorization.js';
