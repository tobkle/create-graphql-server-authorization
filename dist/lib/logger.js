"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stream = undefined;

var _winston = require("winston");

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates a logger based on winston
 * @param {object} me
 * @return {boolean} logger
 */

_winston2.default.emitErrs = true;

var timestamp = function timestamp() {
  return new Date(Date.now()).toLocaleString();
};

var formatter = function formatter(options) {
  return options.timestamp() + " " + (options.level === "error" ? " " + options.level.toUpperCase() : "") + " " + (options.message ? options.message : "") + (options.meta && Object.keys(options.meta).length ? "\n\t" + JSON.stringify(options.meta) : "");
};

var logger = new _winston2.default.Logger({
  transports: [new _winston2.default.transports.File({
    level: "debug",
    filename: "./server/logs/all-logs-readable.log",
    handleExceptions: true,
    json: false,
    maxsize: 5242880, //5MB
    maxFiles: 5,
    colorize: false,
    timestamp: timestamp,
    formatter: formatter
  }), new _winston2.default.transports.Console({
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
    timestamp: timestamp,
    formatter: formatter
  })],

  exitOnError: false
});

exports.default = logger;
var stream = exports.stream = {
  write: function write(message, encoding) {
    // logger.debug(message);
  }
};