import getLogFilename from "../dist/lib/getLogFilename";

const expect = require('chai').expect;

describe('getLogFilename', function() {

  it('to return a logFilename', function() {
    const logFilename= getLogFilename();
    expect(logFilename).be.a('string');
  });

});