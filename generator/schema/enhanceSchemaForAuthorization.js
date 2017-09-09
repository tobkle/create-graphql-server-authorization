'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enhanceSchemaForAuthorization = enhanceSchemaForAuthorization;

var _lodash = require('lodash.clonedeep');

var _lodash2 = _interopRequireDefault(_lodash);

var _constants = require('../../constants');

var _isAuthorizeDirectiveDefined = require('../authorize/isAuthorizeDirectiveDefined');

var _graphql = require('../util/graphql');

var _kinds = require('graphql/language/kinds');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * enhances the schema by additional fields, required for authorization
 * @public
 * @param {object} inputSchema - the input's schema with all fields
 * @return {object} outputSchema - the enhanced output Schema
 */

function enhanceSchemaForAuthorization(inputSchema) {
  var outputSchema = (0, _lodash2.default)(inputSchema);
  var type = outputSchema.definitions[0];
  var TypeName = type.name.value;

  var authorize = (0, _isAuthorizeDirectiveDefined.isAuthorizeDirectiveDefined)(inputSchema);
  if (authorize) {
    // remove @authorize directive from header
    type.directives = type.directives.filter(function (directive) {
      return directive.name.value !== 'authorize';
    });

    // for type User: add field 'password' for 'create'
    if (TypeName === _constants.USER_LITERAL) {
      // get the name of the create<Type>Input
      var createInputTypeName = 'Create' + TypeName + 'Input';

      outputSchema.definitions.filter(function (objType) {
        return objType.kind === _kinds.INPUT_OBJECT_TYPE_DEFINITION && objType.name.value === createInputTypeName;
      }).forEach(function (inputType) {
        return inputType.fields.push((0, _graphql.buildField)('password', [], 'String!'));
      });
    }

    // for all typeNames with authorization: add 'createdBy'
    type.fields.push((0, _graphql.buildField)('createdBy', [], _constants.USER_LITERAL));

    // for all typeNames with authorization: add 'updatedBy'
    type.fields.push((0, _graphql.buildField)('updatedBy', [], _constants.USER_LITERAL));
  }

  return outputSchema;
} /* eslint-disable max-len */