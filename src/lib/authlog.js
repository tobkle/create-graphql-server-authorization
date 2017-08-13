import logger from "./logger";
import getLogFilename from "./getLogFilename";

const expect = require("chai").expect;

/*
 * Central logger for authorization checks
 * @param {string} resolver
 * @param {string} mode
 * @param {object} me
 * @return {
 *    debug {function},
 *    error {function} 
 * }
 */
function authlog(resolver = "", mode = "", me = {}) {
  const logFilename = getLogFilename();
  const log = logger(logFilename);

  const makeMessage = message =>
    `Authorize ${mode} "${resolver}" with user "${me.username
      ? me.username
      : "<no-user>"}" ${message}`;

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

module.exports = authlog;
