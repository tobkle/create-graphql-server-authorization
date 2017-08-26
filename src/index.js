/*
 * '../index.js' file provides access to all public 
 * create graphql server 
 * authorization functions
 */

/* for the model authorization logic */
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
  generateAuthorizationCode,
  isAuthorizeDirectiveDefined
} from './generate/index.js';
