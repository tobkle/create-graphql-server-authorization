import path from 'path';

const expect = require('chai').expect;

/* Get log filename
 * package.json should be existing in current working directory
 * and should have a section 'config' with a 'logfile' name
 * @return (string) logFilename
 */
export function getLogFilename() {
  const packageJSON = require(`${process.cwd()}/package.json`);
  const logFilename = path.normalize(packageJSON.config.logfile);
  expect(logFilename).be.a('string');
  return logFilename;
}
