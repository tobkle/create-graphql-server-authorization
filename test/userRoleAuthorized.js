'use strict';

var expect = require('chai').expect;
import authlog from "../src/lib/authlog";

describe('authlog', function() {
  it('should return an object with "error" and "debug"', function() {
    var resolver = '';
    var mode = '';
    var me = {};
    var result = authlog(resolver, mode, me);
    expect(result).to.have.property('error');
    expect(result).to.have.property('debug');
  });
});