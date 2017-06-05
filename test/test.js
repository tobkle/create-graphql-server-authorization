'use strict';

var expect = require('chai').expect;
var auth = require('../index');

describe('authorization', function() {
  it('should return a boolean', function() {
    var role = 'user';
    var mode = 'read';
    var result = auth(role, mode);
    expect(result).to.be.a('boolean');
  });
});
