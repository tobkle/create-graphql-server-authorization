'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCode = getCode;

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _getContext = require('./getContext');

var _getPartials = require('./getPartials');

var _getName = require('./getName');

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * get generated code from template partials
 * @public
 * @param {string} codeType - MODEL or RESOLVER run
 * @param {object} config - configuration object
 * @property {object} inputSchema - schema of the type 
 * @property {string} userType - the user type
 * @property {string} defaultTemplate - name of the start template
 * @property {array} basePath - path to the base templates directory
 * @property {string} baseExtension - file extension '.template'
 * @property {string} baseEncoding - base file encoding 'utf8'
 * @property {string} baseCommonDir - commonly used template partials
 * @property {string} baseDefaultDir - default directory for templates
 * @property {function} baseGetNameFunc - calculate the name of a partial
 * @property {array} authPath - path to the authorization templates directory
 * @property {string} authExtension - auth file encoding 'utf8'
 * @property {string} authEncoding - auth file encoding
 * @property {string} authCommonDir - commonly used auth template partials
 * @property {string} authDefaultDir - default directory for auth templates
 * @property {function} authGetNameFunc - calculate tne name of a partial
 * @return {string} code - generated code for a model
 */

function getCode() {
  var codeType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _constants.MODEL;
  var _ref = arguments[1];
  var _ref$userType = _ref.userType,
      userType = _ref$userType === undefined ? _constants.USER_LITERAL : _ref$userType,
      _ref$inputSchema = _ref.inputSchema,
      inputSchema = _ref$inputSchema === undefined ? {} : _ref$inputSchema,
      _ref$defaultTemplate = _ref.defaultTemplate,
      defaultTemplate = _ref$defaultTemplate === undefined ? _constants.TEMPLATES_DEFAULT_TEMPLATE : _ref$defaultTemplate,
      _ref$basePath = _ref.basePath,
      basePath = _ref$basePath === undefined ? [_constants.TEMPLATES_DIR, _constants.TEMPLATES_MODEL_DIR, _constants.TEMPLATES_DEFAULT_DIR] : _ref$basePath,
      _ref$baseExtension = _ref.baseExtension,
      baseExtension = _ref$baseExtension === undefined ? _constants.TEMPLATE_EXTENSION : _ref$baseExtension,
      _ref$baseEncoding = _ref.baseEncoding,
      baseEncoding = _ref$baseEncoding === undefined ? _constants.ENCODING : _ref$baseEncoding,
      _ref$baseCommonDir = _ref.baseCommonDir,
      baseCommonDir = _ref$baseCommonDir === undefined ? _constants.TEMPLATES_COMMON_DIR : _ref$baseCommonDir,
      _ref$baseDefaultDir = _ref.baseDefaultDir,
      baseDefaultDir = _ref$baseDefaultDir === undefined ? _constants.TEMPLATES_DEFAULT_DIR : _ref$baseDefaultDir,
      _ref$baseGetNameFunc = _ref.baseGetNameFunc,
      baseGetNameFunc = _ref$baseGetNameFunc === undefined ? _getName.getName : _ref$baseGetNameFunc,
      _ref$authPath = _ref.authPath,
      authPath = _ref$authPath === undefined ? [_constants.TEMPLATES_DIR, _constants.TEMPLATES_MODEL_DIR, _constants.TEMPLATES_AUTH_DIR] : _ref$authPath,
      _ref$authExtension = _ref.authExtension,
      authExtension = _ref$authExtension === undefined ? _constants.TEMPLATE_EXTENSION : _ref$authExtension,
      _ref$authEncoding = _ref.authEncoding,
      authEncoding = _ref$authEncoding === undefined ? _constants.ENCODING : _ref$authEncoding,
      _ref$authCommonDir = _ref.authCommonDir,
      authCommonDir = _ref$authCommonDir === undefined ? _constants.TEMPLATES_COMMON_DIR : _ref$authCommonDir,
      _ref$authDefaultDir = _ref.authDefaultDir,
      authDefaultDir = _ref$authDefaultDir === undefined ? _constants.TEMPLATES_DEFAULT_DIR : _ref$authDefaultDir,
      _ref$authGetNameFunc = _ref.authGetNameFunc,
      authGetNameFunc = _ref$authGetNameFunc === undefined ? _getName.getName : _ref$authGetNameFunc;

  // partials dictionary for template resolution
  var partials = {};

  // adds helpers to handlebars
  registerHandlebarsHelpers();

  // define the compiler
  function compile(templates) {
    templates.forEach(function (partial) {
      partials[partial.name] = _handlebars2.default.compile(partial.source);
      _handlebars2.default.registerPartial(partial.name, partials[partial.name]);
    });
  }

  // getting data context
  var context = (0, _getContext.getContext)(inputSchema, userType, codeType);
  var TypeName = context.TypeName;
  var typeName = context.typeName;
  var startTemplate = typeName;

  // getting auth common partial templates (might be in an npm module)
  var authCommonPartials = (0, _getPartials.getPartials)({
    basePath: authPath,
    directoryPath: [authCommonDir],
    extension: authExtension,
    encoding: authEncoding,
    getNameFunc: authGetNameFunc
  });

  // getting auth type specific partial templates (might be in an npm module)
  var authTypePartials = (0, _getPartials.getPartials)({
    basePath: authPath,
    directoryPath: [typeName],
    extension: authExtension,
    encoding: authEncoding,
    getNameFunc: authGetNameFunc
  });

  // fallback to auth default partial templates (might be in an npm module)
  if (authTypePartials.length === 0) {
    authTypePartials = (0, _getPartials.getPartials)({
      basePath: authPath,
      directoryPath: [authDefaultDir],
      extension: authExtension,
      encoding: authEncoding,
      getNameFunc: authGetNameFunc
    });
  }

  // getting common partial templates
  var baseCommonPartials = (0, _getPartials.getPartials)({
    basePath: basePath,
    directoryPath: [baseCommonDir],
    extension: baseExtension,
    encoding: baseEncoding,
    getNameFunc: baseGetNameFunc
  });

  // getting type specific partial templates
  var baseTypePartials = (0, _getPartials.getPartials)({
    basePath: basePath,
    directoryPath: [typeName],
    extension: baseExtension,
    encoding: baseEncoding,
    getNameFunc: baseGetNameFunc
  });

  // fallback to default partial templates,
  // if there are no type specific templates found
  if (baseTypePartials.length === 0) {
    baseTypePartials = (0, _getPartials.getPartials)({
      basePath: basePath,
      directoryPath: [baseDefaultDir],
      extension: baseExtension,
      encoding: baseEncoding,
      getNameFunc: baseGetNameFunc
    });
    // reset start template to the default template,
    // as type specific template does not exist
    startTemplate = defaultTemplate;
  }

  // compile all auth partials
  compile(authCommonPartials);
  compile(authTypePartials);

  // compile all base partials
  compile(baseCommonPartials);
  compile(baseTypePartials);

  console.log('Generating ' + codeType + ' for type "' + TypeName + '" with template "' + startTemplate + '"');

  // run start template with data context
  var code = partials[startTemplate](context);

  // return the final code
  return code;
}

/**
 * registers a helper, which could be used in the templates
 * @example
 * {{#foreach}}
 *     {{#if $last}} console.log('this was the last element') {{/if}}
 *     {{#if $notLast}} console.log('this was not the last one') {{/if}}
 * {{/foreach}}
 */

/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

function registerHandlebarsHelpers() {
  _handlebars2.default.registerHelper('foreach', function (arr, options) {
    if (options.inverse && !arr.length) {
      return options.inverse(this);
    }
    return arr.map(function (item, index) {
      item.$index = index;
      item.$first = index === 0;
      item.$last = index === arr.length - 1;
      item.$notFirst = index !== 0;
      item.$notLast = index !== arr.length - 1;
      return options.fn(item);
    }).join('');
  });
}