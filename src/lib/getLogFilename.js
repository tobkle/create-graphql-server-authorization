// @flow

import path from 'path';

const expect = require('chai').expect;

/**
 * Get name for the log file
 * reads package.json for config.logfile variable
 * @public
 * @return (string) logFilename - path and file name for the log file
 */

export function getLogFilename(): string {
  const logFilename = path.normalize(process.env.npm_package_config_logfile);
  expect(logFilename).be.a('string');
  return logFilename;
}
