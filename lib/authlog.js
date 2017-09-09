'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authlog = authlog;

var _constants = require('../constants');

var _createGraphqlServerLogging = require('create-graphql-server-logging');

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

function authlog() {
  var resolver = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var me = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var logFilename = (0, _createGraphqlServerLogging.getLogFilename)();
  var log = (0, _createGraphqlServerLogging.logger)(logFilename);

  var makeMessage = function makeMessage(message) {
    return 'Authorize ' + mode + ' \'' + resolver + '\' with user \'' + (me.username ? me.username : _constants.NO_USER) + '\' ' + message;
  };

  return {
    debug: function debug(message) {
      var resultMessage = makeMessage(message);
      log.debug(resultMessage);
      return resultMessage;
    },
    error: function error(message) {
      var resultMessage = makeMessage(message);
      log.error(resultMessage);
      throw new Error(makeMessage(message));
    }
  };
}