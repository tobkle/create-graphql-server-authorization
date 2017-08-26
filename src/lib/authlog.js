// @flow

import { logger } from './logger';
import { getLogFilename } from './getLogFilename';

/**
 * Central logger for authorization checks
 * @public
 * @param {string} resolver - log name of a resolver
 * @param {string} mode - crud operation name
 * @param {object} me - current user
 * @return {
 *    debug {function} - debug() function
 *    error {function} - error() function
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
      : '<no-user>'}' ${message}`;

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
