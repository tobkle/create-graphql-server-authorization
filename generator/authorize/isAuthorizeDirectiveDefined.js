'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAuthorizeDirectiveDefined = isAuthorizeDirectiveDefined;

var _constants = require('../../constants');

/**
 * checks, if there is authorization logic defined
 * true, if there is an @authorize directive in the header 
 * in the type's inputSchema
 * if there is an @authorize directive => true
 * if thers is no @authorize directive => false
 * @public
 * @param {object} inputSchema - schema for the type
 * @return {boolean} authorized - true, if authorization logic defined
 */

function isAuthorizeDirectiveDefined(inputSchema) {
  var authorize = false;

  inputSchema.definitions.filter(function (def) {
    return def.kind === _constants.OBJECT_TYPE_DEFINITION;
  }).some(function (def) {
    def.directives.some(function (directive) {
      if (directive.name.value === _constants.AUTHORIZE_DIRECTIVE) {
        authorize = true;
      }
    });
  });

  return authorize;
}