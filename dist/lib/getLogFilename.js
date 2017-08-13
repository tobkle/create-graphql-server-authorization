"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getLogFilename;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = require("chai").expect;

/*
 * Get log filename
 * package.json should be existing in current working directory
 * and should have a section "config" with a "logfile" name
 * @return (string) logFilename
 */
function getLogFilename() {
  var packageJSON = require(process.cwd() + "/package.json");
  var logFilename = _path2.default.normalize(packageJSON.config.logfile);
  expect(logFilename).be.a("string");
  return logFilename;
}