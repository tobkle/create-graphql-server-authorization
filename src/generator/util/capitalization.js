/**
 * changes a given string on the first character to lower case
 * @public
 * @param {string} str - string
 * @return {string} str - changed string
 */

export function lcFirst(str) {
  return str[0].toLowerCase() + str.substring(1);
}

/**
 * changes a given string on the first character to upper case
 * @public
 * @param {string} str - string
 * @return {string} str - changed string
 */

export function ucFirst(str) {
  return str[0].toUpperCase() + str.substring(1);
}
