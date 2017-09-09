'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseCode = parseCode;
exports.prep = prep;
exports.lcFirst = lcFirst;
exports.ucFirst = ucFirst;

var _recast = require('recast');

var _babylon = require('babylon');

var babylon = _interopRequireWildcard(_babylon);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var babylonParser = {
  parse: function parse(code) {
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

function parseCode(source) {
  return (0, _recast.parse)(source, { parser: babylonParser });
}

/**
 * prepare roles for code generator
 * convert array to String value
 * replace " by '
 * @private
 * @param {array} role - name of role
 * @return {string} roleString - role string
 */

function prep(role) {
  return JSON.stringify(role).replace(/"/g, "'").replace(/,/g, ', ');
}

/**
 * converts first character of string to lower case
 * @private
 * @param {string} str - string
 * @return {string} converted_string - first character is lower case
 */

function lcFirst(str) {
  return str[0].toLowerCase() + str.substring(1);
}

/**
 * converts first character of string to upper case
 * @private
 * @param {string} str - string
 * @return {string} converted_string - first character is upper case
 */

function ucFirst(str) {
  return str[0].toUpperCase() + str.substring(1);
}