// @flow

import { parse as recastParse } from 'recast';
import * as babylon from 'babylon';

const babylonParser = {
  parse(code) {
    return babylon.parse(code, {
      sourceType: 'module',
      plugins: ['objectRestSpread']
    });
  }
};

/**
 * parses a Code into an abstract syntax tree (AST)
 * @private
 * @param {string} source - source code
 * @return {Object} AST - abstract syntax tree converted source code
 */

export function parseCode(source: string) {
  return recastParse(source, { parser: babylonParser });
}

/**
 * prepare roles for code generator
 * convert array to String value
 * replace " by '
 * @private
 * @param {array} role - name of role
 * @return {string} roleString - role string
 */

export function prep(role: any): string {
  return JSON.stringify(role).replace(/"/g, "'").replace(/,/g, ', ');
}

/**
 * converts first character of string to lower case
 * @private
 * @param {string} str - string
 * @return {string} converted_string - first character is lower case
 */

export function lcFirst(str: string): string {
  return str[0].toLowerCase() + str.substring(1);
}

/**
 * converts first character of string to upper case
 * @private
 * @param {string} str - string
 * @return {string} converted_string - first character is upper case
 */

export function ucFirst(str: string): string {
  return str[0].toUpperCase() + str.substring(1);
}
