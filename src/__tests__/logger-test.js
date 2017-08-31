import { getLogFilename } from '../lib/getLogFilename';
import { logger } from '../lib/logger';

const expect = require('chai').expect;

let logFilename;

describe('logger', function() {
  before(function() {
    logFilename = getLogFilename();
    expect(logFilename).be.a('string');
  });

  it('should return a function with "log"', function() {
    const result = logger(logFilename);
    expect(result).to.have.property('log');
  });

  // This is tested more in depth in test/authlog.js
});
