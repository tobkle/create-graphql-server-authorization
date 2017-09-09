'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generatePerField;

var _lodash = require('lodash.clonedeep');

var _lodash2 = _interopRequireDefault(_lodash);

var _capitalization = require('./capitalization');

var _graphql = require('./graphql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * changes a given string on the first character to lower case
 * @public
 * @public {object} type - schema type
 * @public {object} generators - object with generator methods
 * @return {object} generatorResults - field context for templates
 */

function generatePerField(type, generators) {
  var TypeName = type.name.value;
  var typeName = (0, _capitalization.lcFirst)(TypeName);

  // XXX: this logic is shared in the schema generation code.
  // We should probably find a way to use generatePerField for the schema too.
  var ignoreField = function ignoreField(field) {
    var directivesByName = {};
    field.directives.forEach(function (d) {
      directivesByName[d.name.value] = d;
    });
    return !(0, _graphql.isScalarField)(field) && !directivesByName.enum;
  };

  return type.fields.filter(ignoreField).map(function (originalField) {
    var field = (0, _lodash2.default)(originalField);
    (0, _graphql.applyCustomDirectives)(field);

    // find the first directive on the field that has a generator
    var directive = field.directives.find(function (d) {
      return Boolean(generators[d.name.value]);
    });
    var fieldName = field.name.value;
    var ReturnTypeName = (0, _graphql.getBaseType)(field.type).name.value;

    var argNames = field.arguments.map(function (a) {
      return a.name.value;
    });
    var argsStr = 'args';
    if (argNames.length > 0) {
      argsStr = '{ ' + argNames.join(', ') + ' }';
    }

    if (directive) {
      var _generator = generators[directive.name.value];
      var options = (0, _graphql.argumentsToObject)(directive.arguments);
      return _generator({ TypeName: TypeName, typeName: typeName, fieldName: fieldName, argsStr: argsStr, ReturnTypeName: ReturnTypeName }, options);
    }

    // XXX: chances are we'll want to change this but this works for now
    var isArrayField = field.type.kind === 'ListType';
    var generator = isArrayField ? generators.belongsToMany : generators.belongsTo;
    return generator({ TypeName: TypeName, typeName: typeName, fieldName: fieldName, argsStr: argsStr, ReturnTypeName: ReturnTypeName }, { as: fieldName });
  });
}