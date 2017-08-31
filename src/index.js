/* eslint-disable max-len */

/*
 * @desc create-graphql-server-authorization
 * @desc provides access to all public functions
 * @public
 * @param {function} getLogFilename - get name of log file
 * @param {function} dummyUserContext - get user.role
 * @param {function} logger - write to authorization log file
 * @param {function} authlog - how to log
 * @param {function} checkAuthDoc - checks, if authorized for document
 * @param {function} fieldContainsUserId - checks, if field contains user id
 * @param {function} findByIds - find documents with their ids, cached
 * @param {function} loggedIn - checks, if user logged in
 * @param {function} protectFields - protects fields for authorized users
 * @param {function} queryForRoles - creates authQuery for later data operations
 * @param {function} userRoleAuthorized - checks, if a user's role is authorized
 * @param {function} getCode - generates authorization code for models and resolvers during add-type
 * @param {function} isAuthorizeDirectiveDefined - returns true, if authorization logic is defined
 * @param {function} adjustSchemaForAuthorization - returns an array of fields for schema
 */

/* for the authorization logic */
export { getLogFilename } from './lib/getLogFilename.js';
export { dummyUserContext } from './lib/dummyUserContext.js';
export { logger } from './lib/logger.js';
export { authlog } from './lib/authlog.js';
export { checkAuthDoc } from './lib/checkAuthDoc.js';
export { fieldContainsUserId } from './lib/fieldContainsUserId.js';
export { findByIds } from './lib/findByIds.js';
export { loggedIn } from './lib/loggedIn.js';
export { protectFields } from './lib/protectFields.js';
export { queryForRoles } from './lib/queryForRoles.js';
export { userRoleAuthorized } from './lib/userRoleAuthorized.js';

/* for the code generator */
export {
  getCode
} from './generator/getCode.js';

export {
  isAuthorizeDirectiveDefined
} from './generator/authorize/isAuthorizeDirectiveDefined.js';

export {
  adjustSchemaForAuthorization
} from './generator/schema/adjustSchemaForAuthorization.js';
