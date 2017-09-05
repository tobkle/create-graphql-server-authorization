/* eslint-disable max-len */
import fs from 'fs';
import path from 'path';

import { onAuthRegisterLoader } from '../lib/onAuthRegisterLoader';
import { getLogFilename } from 'create-graphql-server-logging';

const assert = require('chai').assert;
const expect = require('chai').expect;

const resolver = 'onAuthRegisterLoader';
const mode = 'testMode';
const that = {};

let logFilename;
let directoryName;

describe('onAuthRegisterLoader', function() {
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

  it('should return a function "registerLoader", "error" and "debug"', function() {
    const log = onAuthRegisterLoader();
    expect(log).to.have.property('error');
    expect(log).to.have.property('debug');
    expect(log).to.have.property('registerLoader');
    assert.isFunction(log.error);
    assert.isFunction(log.debug);
  });

  it('function log.registerLoader should return: "registered authorizedLoader successfully"', function() {
    const me = {};
    const log = onAuthRegisterLoader(resolver, mode, me, that);

    let result = '';
    const testFunction = function() {
      const authQuery = {};
      result = log.registerLoader(authQuery);
    };
    expect(testFunction).to.not.throw();
    expect(result).to.match(/registered authorizedLoader successfully/);
    expect(that).to.have.property('authorizedLoader');
  });

  it('function log.debug should return: "Authorize testMode "onAuthRegisterLoader" with user "<no-user>" hello log.debug"', function() {
    const log = onAuthRegisterLoader(resolver, mode);
    const message = 'hello log.debug';

    let result = '';
    const testFunction = function() {
      result = log.debug(message);
      return result;
    };
    expect(testFunction).to.not.throw();
    expect(result).to.match(
      /Authorize testMode 'onAuthRegisterLoader' with user '<no-user>' hello log\.debug/
    );
  });

  it('function log.debug should return: "Authorize testMode "onAuthRegisterLoader" with user "tobkle" hello log.debug"', function() {
    const me = {
      username: 'tobkle',
      email: 'test@example.com'
    };
    const log = onAuthRegisterLoader(resolver, mode, me);
    const message = 'hello log.debug';

    let result = '';
    const testFunction = function() {
      result = log.debug(message);
      return result;
    };
    expect(testFunction).to.not.throw();
    expect(result).to.match(
      /Authorize testMode 'onAuthRegisterLoader' with user 'tobkle' hello log\.debug/
    );
  });

  it('function log.error should not throw exception and return: ERROR Authorize testMode "onAuthRegisterLoader" with user "<no-user>" test-error', function() {
    const me = {};
    const log = onAuthRegisterLoader(resolver, mode, me);
    const message = 'test-error';

    const testFunction = function() {
      log.error(message);
    };
    expect(testFunction).to.not.throw(message);
  });
});
