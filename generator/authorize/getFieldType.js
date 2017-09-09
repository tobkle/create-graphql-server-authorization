'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFieldType = getFieldType;

var _constants = require('../../constants');

/**
 * get the field's type 
 * @private
 * @param {object} field - AST with field definitions
 * @return {type} fieldType - returns the type of the field
 * @example 'role: String'
 * @example 'role: String!'
 * @example 'coauthors: [User]'
 * @example 'coauthors: [User]!'
 * @example 'coauthors: [User!]'
 * @example 'coauthors: [User!]!'
 */

function getFieldType(field) {
  // pattern: 'role: String'
  if (field.type.kind === _constants.NAMED_TYPE && field.type.name.kind === _constants.NAME) {
    if (field.type.name.value === _constants.STRING_LITERAL) {
      return _constants.STRING_LITERAL;
    }
    if (field.type.name.value === _constants.USER_LITERAL) {
      return _constants.USER_LITERAL;
    }
  }

  // pattern: 'role: String!'
  if (field.type.kind === _constants.NON_NULL_TYPE && field.type.type.name.kind === _constants.NAME) {
    if (field.type.type.name.value === _constants.STRING_LITERAL) {
      return _constants.STRING_LITERAL;
    }
    if (field.type.type.name.value === _constants.USER_LITERAL) {
      return _constants.USER_LITERAL;
    }
  }

  // pattern: 'coauthors: [User]'
  if (field.type.kind === _constants.LIST_TYPE && field.type.type.name.kind === _constants.NAME) {
    if (field.type.type.name.value === _constants.STRING_LITERAL) {
      return _constants.STRING_LIST;
    }
    if (field.type.type.name.value === _constants.USER_LITERAL) {
      return _constants.USER_LIST;
    }
  }

  // pattern: 'coauthors: [User]!'
  if (field.type.kind === _constants.NON_NULL_TYPE && field.type.type.kind === _constants.LIST_TYPE && field.type.type.type.kind === _constants.NAMED_TYPE && field.type.type.type.name.kind === _constants.NAME) {
    if (field.type.type.type.name.value === _constants.STRING_LITERAL) {
      return _constants.STRING_LIST;
    }
    if (field.type.type.type.name.value === _constants.USER_LITERAL) {
      return _constants.USER_LIST;
    }
  }

  // pattern: 'coauthors: [User!]'
  if (field.type.kind === _constants.LIST_TYPE && field.type.type.kind === _constants.NON_NULL_TYPE && field.type.type.type.kind === _constants.NAMED_TYPE && field.type.type.type.name.kind === _constants.NAME) {
    if (field.type.type.type.name.value === _constants.STRING_LITERAL) {
      return _constants.STRING_LIST;
    }
    if (field.type.type.type.name.value === _constants.USER_LITERAL) {
      return _constants.USER_LIST;
    }
  }

  // pattern: 'coauthors: [User!]!'
  if (field.type.kind === _constants.NON_NULL_TYPE && field.type.type.kind === _constants.LIST_TYPE && field.type.type.type.kind === _constants.NON_NULL_TYPE && field.type.type.type.type.kind === _constants.NAMED_TYPE && field.type.type.type.type.name.kind === _constants.NAME) {
    if (field.type.type.type.type.name.value === _constants.STRING_LITERAL) {
      return _constants.STRING_LIST;
    }
    if (field.type.type.type.type.name.value === _constants.USER_LITERAL) {
      return _constants.USER_LIST;
    }
  }

  return null;
}