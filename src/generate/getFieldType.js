// @flow

import {
  NAMED_TYPE,
  NAME,
  STRING,
  USER,
  NON_NULL_TYPE,
  LIST_TYPE,
  LIST_OF_STRINGS,
  LIST_OF_USERS
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
  if (
    field.type &&
    field.type.kind &&
    field.type.kind === NAMED_TYPE &&
    field.type.name &&
    field.type.name.kind &&
    field.type.name.kind === NAME &&
    field.type.name.value
  ) {
    if (field.type.name.value === STRING) {
      return STRING;
    }

    if (field.type.name.value === USER) {
      return USER;
    }
  }

  // pattern: 'role: String!'
  if (
    field.type &&
    field.type.kind &&
    field.type.kind === NON_NULL_TYPE &&
    field.type.type &&
    field.type.type.name &&
    field.type.type.name.kind &&
    field.type.type.name.kind === NAME &&
    field.type.type.name.value
  ) {
    if (field.type.type.name.value === STRING) {
      return STRING;
    }

    if (field.type.type.name.value === USER) {
      return USER;
    }
  }

  // pattern: 'coauthors: [User]'
  if (
    field.type &&
    field.type.kind &&
    field.type.kind === LIST_TYPE &&
    field.type.type &&
    field.type.type.name &&
    field.type.type.name.kind &&
    field.type.type.name.kind === NAME &&
    field.type.type.name.value
  ) {
    if (field.type.type.name.value === STRING) {
      return LIST_OF_STRINGS;
    }

    if (field.type.type.name.value === USER) {
      return LIST_OF_USERS;
    }
  }

  // pattern: 'coauthors: [User]!'
  if (
    field.type &&
    field.type.kind &&
    field.type.kind === NON_NULL_TYPE &&
    field.type.type &&
    field.type.type.kind &&
    field.type.type.kind === LIST_TYPE &&
    field.type.type.type &&
    field.type.type.type.kind &&
    field.type.type.type.kind === NAMED_TYPE &&
    field.type.type.type.name &&
    field.type.type.type.name.kind &&
    field.type.type.type.name.kind === NAME &&
    field.type.type.type.name.value
  ) {
    if (field.type.type.type.name.value === STRING) {
      return LIST_OF_STRINGS;
    }

    if (field.type.type.type.name.value === USER) {
      return LIST_OF_USERS;
    }
  }

  // pattern: 'coauthors: [User!]'
  if (
    field.type &&
    field.type.kind &&
    field.type.kind === LIST_TYPE &&
    field.type.type &&
    field.type.type.kind &&
    field.type.type.kind === NON_NULL_TYPE &&
    field.type.type.type &&
    field.type.type.type.kind &&
    field.type.type.type.kind === NAMED_TYPE &&
    field.type.type.type.name &&
    field.type.type.type.name.kind &&
    field.type.type.type.name.kind === NAME &&
    field.type.type.type.name.value
  ) {
    if (field.type.type.type.name.value === STRING) {
      return LIST_OF_STRINGS;
    }

    if (field.type.type.type.name.value === USER) {
      return LIST_OF_USERS;
    }
  }

  // pattern: 'coauthors: [User!]!'
  if (
    field.type &&
    field.type.kind &&
    field.type.kind === NON_NULL_TYPE &&
    field.type.type &&
    field.type.type.kind &&
    field.type.type.kind === LIST_TYPE &&
    field.type.type.type &&
    field.type.type.type.kind &&
    field.type.type.type.kind === NON_NULL_TYPE &&
    field.type.type.type.type &&
    field.type.type.type.type.kind &&
    field.type.type.type.type.kind === NAMED_TYPE &&
    field.type.type.type.type.name &&
    field.type.type.type.type.name.kind &&
    field.type.type.type.type.name.kind === NAME &&
    field.type.type.type.type.name.value
  ) {
    if (field.type.type.type.type.name.value === STRING) {
      return LIST_OF_STRINGS;
    }

    if (field.type.type.type.type.name.value === USER) {
      return LIST_OF_USERS;
    }
  }

  return null;
}
