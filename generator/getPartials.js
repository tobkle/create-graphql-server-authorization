'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPartials = getPartials;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _getName = require('./getName');

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * reads all available partials of a template directory
 * @public
 * @param {Object} configPartial - configuration object
 * @property {array} basePath - base directory to start reading
 * @property {array} directoryPath - partials directory name parts
 * @property {array} extension - extension name for template files '.template'
 * @property {array} encoding - encoding of template files 'utf8'
 * @property {Function} getNameFunc - optional, 
 * otherwise getDefaultName function is used
 * @return {array} partials - repository with all partials
 *
 * @example
 *  partials = [
 *    {
 *      "name": "hello",
 *      "path": "templates/default/hello.template",
 *      "source": "console.log('Hello World')"
 *    }
 *  ]
 */

function getPartials(_ref) {
  var _ref$basePath = _ref.basePath,
      basePath = _ref$basePath === undefined ? [] : _ref$basePath,
      _ref$directoryPath = _ref.directoryPath,
      directoryPath = _ref$directoryPath === undefined ? [] : _ref$directoryPath,
      _ref$extension = _ref.extension,
      extension = _ref$extension === undefined ? _constants.TEMPLATE_EXTENSION : _ref$extension,
      _ref$encoding = _ref.encoding,
      encoding = _ref$encoding === undefined ? _constants.ENCODING : _ref$encoding,
      _ref$getNameFunc = _ref.getNameFunc,
      getNameFunc = _ref$getNameFunc === undefined ? _getName.getName : _ref$getNameFunc;

  // collect all found partials in this partials array
  var partials = [];

  // prepare directory name
  var partialsDirectory = _path2.default.join.apply(_path2.default, basePath.concat(directoryPath));

  // checks if name is an existing directory
  if (!_fs2.default.existsSync(partialsDirectory) || !_fs2.default.statSync(partialsDirectory).isDirectory()) {
    return partials;
  }

  // for easier reading as function: process directory tree recursively
  function filter_and_recursion_processing(file) {
    var filePath = _path2.default.join.apply(_path2.default, basePath.concat(directoryPath, [file]));

    if (_path2.default.extname(file) === extension) {
      // partial file is found, passing through filter, process it later
      return file;
    } else if (_fs2.default.statSync(filePath).isDirectory()) {
      // directory found, do recursion and get processed partials back
      partials = partials.concat(getPartials({
        basePath: basePath,
        directoryPath: [].concat(directoryPath, [file]),
        extension: extension,
        encoding: encoding,
        getNameFunc: getNameFunc
      }));
    }

    return false;
  }

  // for easier reading as function: process a partial template
  function partial_processing(file) {
    var partial = {};

    partial.name = getNameFunc(directoryPath, file, extension);
    partial.path = _path2.default.join.apply(_path2.default, basePath.concat(directoryPath, [file]));
    partial.source = _fs2.default.readFileSync(partial.path, encoding);

    partials.push(partial);
  }

  // read directory tree, filter for '.template' files, sort them, process them
  _fs2.default.readdirSync(partialsDirectory).filter(filter_and_recursion_processing).sort().forEach(partial_processing);

  return partials;
}