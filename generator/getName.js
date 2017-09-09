'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getName = getName;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * get the name of the partial template according to default naming convention
 * defines the name of the partial template in its directory structure
 * prepare name prefix: take just partial name on root template directory
 * on deeper directory structures, prefix directory name to partial name
 * @private
 * @param {array} directoryPath - partials directory name parts
 * @param {string} filename - file name of the partial template
 * @param {string} extension - file extension
 * @return {string} name - name of the partial
 * 
 * @example
 * name = hello               {base}/hello.template
 * name = auth_hello          {base}/auth/hello.template
 * name = auth_special_hello  {base}/auth/special/hello.template
 */

function getName(directoryPath, filename, extension) {
  var dirClone = [].concat(directoryPath);
  var prefix = '';
  if (dirClone.length > 1) {
    dirClone.shift();
    prefix = dirClone.reduce(function (str, dir) {
      return str.concat(dir, '_');
    }, '');
  }
  return prefix.concat(_path2.default.basename(filename, extension));
}