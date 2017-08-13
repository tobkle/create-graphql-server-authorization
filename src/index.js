/*
 * Provides access to all public 
 * create graphql server 
 * authorization functions
 */

import getLogFilename from './lib/getLogFilename';
import logger from './lib/logger';
import authlog from "./lib/authlog";
import checkAuthDoc from './lib/checkAuthDoc';
import fieldContainsUserId from './lib/fieldContainsUserId';
import findByIds from './lib/findByIds';
import loggedIn from './lib/loggedIn';
import protectFields from './lib/protectFields';
import queryForRoles from './lib/queryForRoles';
import userRoleAuthorized from './lib/userRoleAuthorized';

export default {
  getLogFilename, 
  logger, 
  authlog, 
  checkAuthDoc, 
  fieldContainsUserId, 
  findByIds, 
  loggedIn, 
  protectFields, 
  queryForRoles, 
  userRoleAuthorized, 
};
