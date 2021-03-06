// @flow
/* eslint-disable max-len */

import _ from 'lodash';

/**
 * extracts a UserId from an _id object
 * @private
 * @param {object} userIdObject - user object
 * @return {string} newUserId - id of the user
 */

function extractUserId(userIdObject: any): any {
  let newUserId = '';
  if (_.isObject(userIdObject)) {
    Object.keys(userIdObject).forEach(field => {
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

export function fieldContainsUserId(
  docRoleField: any,
  compressedUserId: any
): boolean {
  let found = false;

  // empty docRoleField is not a valid docRoleField
  if (!docRoleField || docRoleField === '' || docRoleField.length === 0) {
    return false;
  }

  // empty (compressed) userId is not a valid userId
  if (
    !compressedUserId ||
    compressedUserId === '' ||
    compressedUserId.toString() === ''
  ) {
    return false;
  }

  // extract userId, if it is a mongoID field
  const userId = extractUserId(compressedUserId);

  // empty (uncompressed) userId is not a valid userId
  if (!userId || userId === '') {
    return false;
  }

  // docRoleField of type Array
  if (_.isArray(docRoleField)) {
    docRoleField.forEach(field => {
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
  if (_.isObject(docRoleField)) {
    // For each field in the object
    Object.keys(docRoleField).forEach(field => {
      if (
        fieldContainsUserId(docRoleField[field], userId) ||
        fieldContainsUserId(field, userId)
      ) {
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
