import ObjectId from 'bson-objectid';

import { loggedIn } from '../lib/loggedIn';

const assert = require('chai').assert;

describe('loggedIn', function() {
  it('should return false, if not logged in', function() {
    const me = {};
    const result = loggedIn(me);
    assert.isFalse(result);
  });

  it('should return true, if logged in', function() {
    const me = {
      _id: ObjectId('583291a1638566b3c5a92ca0'),
      username: 'tmeasday'
    };
    const result = loggedIn(me);
    assert.isTrue(result);
  });
});
