"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stream = undefined;

var _winston = require("winston");

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Creates a logger based on winston
 * @param {object} me
 * @return {boolean} logger
 */

_winston2.default.emitErrs = true;

// create timestamps in local format
var timestamp = function timestamp() {
  return new Date(Date.now()).toLocaleString();
};

// format the output messages
var formatter = function formatter(options) {
  return options.timestamp() + " " + (options.level === "error" ? " " + options.level.toUpperCase() : "") + " " + (options.message ? options.message : "") + (options.meta && Object.keys(options.meta).length ? "\n\t" + JSON.stringify(options.meta) : "");
};

// creates the logger, which outputs messages to file and to console
var logger = function logger(filename) {
  return new _winston2.default.Logger({
    transports: [new _winston2.default.transports.File({
      level: "debug",
      filename: filename,
      handleExceptions: true,
      json: false,
      maxsize: 5 * 1024 * 1024, //5MB
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
};

exports.default = logger;

// define an output stream

var stream = exports.stream = {
  write: function write(message, encoding) {
    logger.debug(message);
  }
};