/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
import ObjectId from 'bson-objectid';

import { fieldContainsUserId } from '../lib/fieldContainsUserId';

const expect = require('chai').expect;

describe('fieldContainsUserId', function() {
  it('should return false on empty call', function() {
    const result = fieldContainsUserId();
    expect(result).to.be.false;
  });

  it('should return false on empty docRoleField Array', function() {
    const docRoleField = [];
    const userId = '';
    const result = fieldContainsUserId(docRoleField, userId);
    expect(result).to.be.false;
  });

  it('should return false on empty docRoleField Object', function() {
    const docRoleField = {};
    const userId = '';
    const result = fieldContainsUserId(docRoleField, userId);
    expect(result).to.be.false;
  });

  it('should return false on docRoleField Array with element ""', function() {
    const docRoleField = [''];
    const userId = '';
    const result = fieldContainsUserId(docRoleField, userId);
    expect(result).to.be.false;
  });

  it('should return false on docRoleField Object field: ""', function() {
    const docRoleField = {
      field: ''
    };
    const userId = '';
    const result = fieldContainsUserId(docRoleField, userId);
    expect(result).to.be.false;
  });

  it('should return false on empty docRoleField String and empty userId String', function() {
    const docRoleField = '';
    const userId = '';
    const result = fieldContainsUserId(docRoleField, userId);
    expect(result).to.be.false;
  });

  it('should return false on empty docRoleField but userId String', function() {
    const docRoleField = [];
    const userId = '583291a1638566b3c5a92ca1';
    const result = fieldContainsUserId(docRoleField, userId);
    expect(result).to.be.false;
  });

  it('should return false on empty docRoleField but userId Object', function() {
    const docRoleField = [];
    const userId = {
      $oid: '583291a1638566b3c5a92ca1'
    };
    const result = fieldContainsUserId(docRoleField, userId);
    expect(result).to.be.false;
  });

  it('should return true on docRoleField String = userId String', function() {
    const docRoleField = '583291a1638566b3c5a92ca1';
    const userId = '583291a1638566b3c5a92ca1';
    const result = fieldContainsUserId(docRoleField, userId);
    expect(result).to.be.true;
  });

  it('should return true on docRoleField Array = userId String', function() {
    const docRoleField = ['583291a1638566b3c5a92ca1'];
    const userId = '583291a1638566b3c5a92ca1';
    const result = fieldContainsUserId(docRoleField, userId);
    expect(result).to.be.true;
  });

  it('should return true on docRoleField Object with fields = userId String', function() {
    const docRoleField = {
      field1: '583291a1638566b3c5a92ca1',
      field2: 'xxx'
    };
    const userId = '583291a1638566b3c5a92ca1';
    const result = fieldContainsUserId(docRoleField, userId);
    expect(result).to.be.true;
  });

  it('should return true on docRoleField field Object Array = userId String', function() {
    const docRoleField = [
      {
        field0: 'xxx'
      },
      {
        field1: '583291a1638566b3c5a92ca1'
      },
      {
        field2: 'xxx'
      }
    ];
    const userId = '583291a1638566b3c5a92ca1';
    const result = fieldContainsUserId(docRoleField, userId);
    expect(result).to.be.true;
  });

  it('should return true on docRoleField Object with fields = userId Object', function() {
    const docRoleField = {
      field1: '583291a1638566b3c5a92ca1',
      field2: 'xxx'
    };
    const userId = {
      $oid: '583291a1638566b3c5a92ca1'
    };
    const result = fieldContainsUserId(docRoleField, userId);
    expect(result).to.be.true;
  });

  it('should return true on docRoleField Object with fields and IdObject = userId Object', function() {
    const docRoleField = {
      field1: {
        $oid: '583291a1638566b3c5a92ca1'
      },
      field2: {
        $oid: '583291a1638566b3c5a9000'
      }
    };
    const userId = {
      $oid: '583291a1638566b3c5a92ca1'
    };
    const result = fieldContainsUserId(docRoleField, userId);
    expect(result).to.be.true;
  });

  it('should return true on docRoleField field Object Array = userId Object', function() {
    const docRoleField = [
      {
        field0: 'xxx'
      },
      {
        field1: '583291a1638566b3c5a92ca1'
      },
      {
        field2: 'xxx'
      }
    ];
    const userId = {
      $oid: '583291a1638566b3c5a92ca1'
    };
    const result = fieldContainsUserId(docRoleField, userId);
    expect(result).to.be.true;
  });

  it('should return true on docRoleField field Object Array = userId Object', function() {
    const docRoleField = [
      {
        field0: {
          $oid: '583291a1638566b3c5a90000'
        }
      },
      {
        field1: {
          $oid: '583291a1638566b3c5a92ca1'
        }
      },
      {
        field2: {
          $oid: '583291a1638566b3c5a90000'
        }
      }
    ];
    const userId = {
      $oid: '583291a1638566b3c5a92ca1'
    };
    const result = fieldContainsUserId(docRoleField, userId);
    expect(result).to.be.true;
  });

  it('should return true on docRoleField Object with ObjectID fields = userId Object', function() {
    const docRoleField = {
      field1: ObjectId('583291a1638566b3c5a92ca1'),
      field2: ObjectId('583291a1638566b3c5a90000')
    };
    const userId = ObjectId('583291a1638566b3c5a92ca1');
    const result = fieldContainsUserId(docRoleField, userId);
    expect(result).to.be.true;
  });
});
