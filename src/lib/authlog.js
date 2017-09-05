// @flow

import { NO_USER } from '../constants';
import { logger } from 'create-graphql-server-logging';
import { getLogFilename } from 'create-graphql-server-logging';

/**
 * Central logger for authorization checks
 * @public
 * @param {string} resolver - log name of a resolver
 * @param {string} mode - crud operation name
 * @param {object} me - current user
 * @return {Object} return - Object with two functions
 * @property {function} debug - debug() function
 * @property {function} error - error() function
 * @throws {Error} - throws Error message in the error() function
 * }
 */

export function authlog(
  resolver: string = '',
  mode: string = '',
  me?: any = {}
): { debug: any, error: any } {
  const logFilename = getLogFilename();
  const log = logger(logFilename);

  const makeMessage = message =>
    `Authorize ${mode} '${resolver}' with user '${me.username
      ? me.username
      : NO_USER}' ${message}`;

  return {
    debug: message => {
      const resultMessage = makeMessage(message);
      log.debug(resultMessage);
      return resultMessage;
    },
    error: message => {
      const resultMessage = makeMessage(message);
      log.error(resultMessage);
      throw new Error(makeMessage(message));
    }
  };
}
