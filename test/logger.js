import fs from 'fs';
import path from 'path';

import getLogFilename from "../dist/lib/getLogFilename";
import logger from "../dist/lib/logger";

var expect = require('chai').expect;

let logFilename;

describe('logger', function() {

  before(function(){
    logFilename = getLogFilename();
    expect(logFilename).be.a("string");
  });

  it('should return a function with "log"', function() {
    var result = logger(logFilename);
    expect(result).to.have.property('log');
  });

  // This is tested more in depth in test/authlog.js

});