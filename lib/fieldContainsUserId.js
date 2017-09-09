'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fieldContainsUserId = fieldContainsUserId;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * extracts a UserId from an _id object
 * @private
 * @param {object} userIdObject - user object
 * @return {string} newUserId - id of the user
 */

function extractUserId(userIdObject) {
  var newUserId = '';
  if (_lodash2.default.isObject(userIdObject)) {
    Object.keys(userIdObject).forEach(function (field) {
      newUserId = userIdObject[field];
    });
  } else {
    newUserId = userIdObject;
  }
  return newUserId;
}

/**
 * checks, if a field contains a user's id
 * returns true, if a field of type array/object/string contains the userId
 * @public
 * @param {object} docRoleField - the field to be checked
 * @param {object} compressedUserId - the user id to test
 * @return {boolean} found - true if it contains the user id
 */

/* eslint-disable max-len */

function fieldContainsUserId(docRoleField, compressedUserId) {
  var found = false;

  // empty docRoleField is not a valid docRoleField
  if (!docRoleField || docRoleField === '' || docRoleField.length === 0) {
    return false;
  }

  // empty (compressed) userId is not a valid userId
  if (!compressedUserId || compressedUserId === '' || compressedUserId.toString() === '') {
    return false;
  }

  // extract userId, if it is a mongoID field
  var userId = extractUserId(compressedUserId);

  // empty (uncompressed) userId is not a valid userId
  if (!userId || userId === '') {
    return false;
  }

  // docRoleField of type Array
  if (_lodash2.default.isArray(docRoleField)) {
    docRoleField.forEach(function (field) {
      if (fieldContainsUserId(field, userId)) {
        found = true;
      }
    });
    if (found) {
      return true;
    }
    return false;
  }

  // docRoleField of type Object
  if (_lodash2.default.isObject(docRoleField)) {
    // For each field in the object
    Object.keys(docRoleField).forEach(function (field) {
      if (fieldContainsUserId(docRoleField[field], userId) || fieldContainsUserId(field, userId)) {
        found = true;
      }
    });
    if (found) {
      return true;
    }
    return false;
  }

  // docRoleField of type field
  if (docRoleField.toString() === userId.toString()) {
    return true;
  }

  return false;
}