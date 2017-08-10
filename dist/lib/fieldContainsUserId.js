"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fieldContainsUserId;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * checks, if a field contains a user's id
 * @param {string, array} docRoleField
 * @param {object} userId
 * @return {boolean} foundUserId
 */

// returns true, if a field of type array/object/string contains the userId
function fieldContainsUserId(docRoleField, userId) {
  var found = false;

  // empty userId is not a valid userId
  if (userId.toString() === "") return false;

  // handle a simple id field
  if (docRoleField.toString() === userId.toString()) {
    return true;
  }

  // handle an array
  if (_lodash2.default.isArray(docRoleField)) {
    docRoleField.every(function (field) {
      if (fieldContainsUserId(field, userId)) {
        found = true;
        return true;
      }
    });
    if (found) return true;
  }

  // handle an object
  if (_lodash2.default.isObject(docRoleField)) {
    Object.keys(docRoleField).every(function (field) {
      // handle a field
      if (docRoleField[field] && docRoleField[field].toString() === userId.toString()) {
        found = true;
        return true;
      }

      // handle an array
      if (_lodash2.default.isArray(docRoleField[field])) {
        docRoleField[field].every(function (innerField) {
          if (fieldContainsUserId(innerField, userId)) {
            found = true;
            return true;
          }
        });
        if (found) return true;
      }

      // handle an object
      if (_lodash2.default.isObject(docRoleField[field])) {
        Object.keys(docRoleField[field]).every(function (innerField) {
          if (fieldContainsUserId(docRoleField[field][innerField], userId)) {
            found = true;
            return true;
          }
        });
        if (found) return true;
      }
    });
  }
  return found;
}