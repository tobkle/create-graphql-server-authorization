// @flow

import {
  NAMED_TYPE,
  NAME,
  STRING_LITERAL,
  USER_LITERAL,
  NON_NULL_TYPE,
  LIST_TYPE,
  STRING_LIST,
  USER_LIST
} from '../constants';

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

export function getFieldType(field: any): string | null {
  
  // pattern: 'role: String'
  if (field.type.kind === NAMED_TYPE && field.type.name.kind === NAME) {
    if (field.type.name.value === STRING_LITERAL) {
      return STRING_LITERAL;
    }
    if (field.type.name.value === USER_LITERAL) {
      return USER_LITERAL;
    }
  }

  // pattern: 'role: String!'
  if (field.type.kind === NON_NULL_TYPE && field.type.type.name.kind === NAME) {
    if (field.type.type.name.value === STRING_LITERAL) {
      return STRING_LITERAL;
    }
    if (field.type.type.name.value === USER_LITERAL) {
      return USER_LITERAL;
    }
  }

  // pattern: 'coauthors: [User]'
  if (field.type.kind === LIST_TYPE && field.type.type.name.kind === NAME) {
    if (field.type.type.name.value === STRING_LITERAL) {
      return STRING_LIST;
    }
    if (field.type.type.name.value === USER_LITERAL) {
      return USER_LIST;
    }
  }

  // pattern: 'coauthors: [User]!'
  if (
    field.type.kind === NON_NULL_TYPE &&
    field.type.type.kind === LIST_TYPE &&
    field.type.type.type.kind === NAMED_TYPE &&
    field.type.type.type.name.kind === NAME
  ) {
    if (field.type.type.type.name.value === STRING_LITERAL) {
      return STRING_LIST;
    }
    if (field.type.type.type.name.value === USER_LITERAL) {
      return USER_LIST;
    }
  }

  // pattern: 'coauthors: [User!]'
  if (
    field.type.kind === LIST_TYPE &&
    field.type.type.kind === NON_NULL_TYPE &&
    field.type.type.type.kind === NAMED_TYPE &&
    field.type.type.type.name.kind === NAME
  ) {
    if (field.type.type.type.name.value === STRING_LITERAL) {
      return STRING_LIST;
    }
    if (field.type.type.type.name.value === USER_LITERAL) {
      return USER_LIST;
    }
  }

  // pattern: 'coauthors: [User!]!'
  if (
    field.type.kind === NON_NULL_TYPE &&
    field.type.type.kind === LIST_TYPE &&
    field.type.type.type.kind === NON_NULL_TYPE &&
    field.type.type.type.type.kind === NAMED_TYPE &&
    field.type.type.type.type.name.kind === NAME
  ) {
    if (field.type.type.type.type.name.value === STRING_LITERAL) {
      return STRING_LIST;
    }
    if (field.type.type.type.type.name.value === USER_LITERAL) {
      return USER_LIST;
    }
  }

  return null;
}
