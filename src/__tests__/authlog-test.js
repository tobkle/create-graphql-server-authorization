/* eslint-disable max-len */
import fs from 'fs';
import path from 'path';

import { authlog } from '../lib/authlog';
import { getLogFilename } from 'create-graphql-server-logging';

const assert = require('chai').assert;
const expect = require('chai').expect;

const resolver = 'authlog';
const mode = 'testMode';

let logFilename;
let directoryName;

describe('authlog', function() {
  before(function() {
    logFilename = getLogFilename();
    expect(logFilename).be.a('string');
    directoryName = path.dirname(logFilename);
    try {
      fs.mkdirSync(directoryName);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
  });

  it('should return a function "error" and "debug"', function() {
    const log = authlog();
    expect(log).to.have.property('error');
    expect(log).to.have.property('debug');
    assert.isFunction(log.error);
    assert.isFunction(log.debug);
  });

  it('function log.debug should return: "Authorize testMode "authlog" with user "<no-user>" hello log.debug"', function() {
    const log = authlog(resolver, mode);
    const message = 'hello log.debug';

    let result = '';
    const testFunction = function() {
      result = log.debug(message);
      return result;
    };
    expect(testFunction).to.not.throw();
    expect(result).to.match(
      /Authorize testMode 'authlog' with user '<no-user>' hello log\.debug/
    );
  });

  it('function log.debug should return: "Authorize testMode "authlog" with user "tobkle" hello log.debug"', function() {
    const me = {
      username: 'tobkle',
      email: 'test@example.com'
    };
    const log = authlog(resolver, mode, me);
    const message = 'hello log.debug';

    let result = '';
    const testFunction = function() {
      result = log.debug(message);
      return result;
    };
    expect(testFunction).to.not.throw();
    expect(result).to.match(
      /Authorize testMode 'authlog' with user 'tobkle' hello log\.debug/
    );
  });

  it('function log.error should throw exception and return: ERROR Authorize testMode "authlog" with user "<no-user>" test-error', function() {
    const me = {};
    const log = authlog(resolver, mode, me);
    const message = 'test-error';

    const testFunction = function() {
      log.error(message);
    };
    expect(testFunction).to.throw(message);
  });
});
