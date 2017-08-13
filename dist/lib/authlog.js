"use strict";

var _logger = require("./logger");

var _logger2 = _interopRequireDefault(_logger);

var _getLogFilename = require("./getLogFilename");

var _getLogFilename2 = _interopRequireDefault(_getLogFilename);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = require("chai").expect;

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
function authlog() {
  var resolver = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var me = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var logFilename = (0, _getLogFilename2.default)();
  var log = (0, _logger2.default)(logFilename);

  var makeMessage = function makeMessage(message) {
    return "Authorize " + mode + " \"" + resolver + "\" with user \"" + (me.username ? me.username : "<no-user>") + "\" " + message;
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

module.exports = authlog;