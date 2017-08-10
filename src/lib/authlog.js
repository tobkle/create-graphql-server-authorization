import log from "./logger";
/**
 * Central logger for authorization checks
 * @param {string} resolver
 * @param {string} mode
 * @param {object} me
 * @return {
 *    debug {function},
 *    error {function} 
 * }
 */

export default function authlog(resolver = "", mode = "", me = {}) {
  const makeMessage = message =>
    `Authorize ${mode} "${resolver}" with user "${me.username
      ? me.username
      : "<no-user>"}" ${message}`;
  return {
    debug: message => log.debug(makeMessage(message)),
    error: message => {
      throw new Error(makeMessage(message));
    }
  };
}
