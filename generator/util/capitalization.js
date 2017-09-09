"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lcFirst = lcFirst;
exports.ucFirst = ucFirst;
/**
 * changes a given string on the first character to lower case
 * @public
 * @param {string} str - string
 * @return {string} str - changed string
 */

function lcFirst(str) {
  return str[0].toLowerCase() + str.substring(1);
}

/**
 * changes a given string on the first character to upper case
 * @public
 * @param {string} str - string
 * @return {string} str - changed string
 */

function ucFirst(str) {
  return str[0].toUpperCase() + str.substring(1);
}