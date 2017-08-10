"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = authlog;

var _logger = require("./logger");

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function authlog() {
  var resolver = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var me = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var makeMessage = function makeMessage(message) {
    return "Authorize " + mode + " \"" + resolver + "\" with user \"" + (me.username ? me.username : "<no-user>") + "\" " + message;
  };
  return {
    debug: function debug(message) {
      return _logger2.default.debug(makeMessage(message));
    },
    error: function error(message) {
      throw new Error(makeMessage(message));
    }
  };
}