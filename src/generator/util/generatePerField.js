import cloneDeep from 'lodash.clonedeep';
import { lcFirst } from './capitalization';

import {
  getBaseType,
  argumentsToObject,
  isScalarField,
  applyCustomDirectives
} from './graphql';

/**
 * changes a given string on the first character to lower case
 * @public
 * @public {object} type - schema type
 * @public {object} generators - object with generator methods
 * @return {object} generatorResults - field context for templates
 */

export default function generatePerField(type, generators) {
  const TypeName = type.name.value;
  const typeName = lcFirst(TypeName);

  // XXX: this logic is shared in the schema generation code.
  // We should probably find a way to use generatePerField for the schema too.
  const ignoreField = field => {
    const directivesByName = {};
    field.directives.forEach(d => {
      directivesByName[d.name.value] = d;
    });
    return !isScalarField(field) && !directivesByName.enum;
  };

  return type.fields.filter(ignoreField).map(originalField => {
    const field = cloneDeep(originalField);
    applyCustomDirectives(field);

    // find the first directive on the field that has a generator
    const directive = field.directives.find(d =>
      Boolean(generators[d.name.value])
    );
    const fieldName = field.name.value;
    const ReturnTypeName = getBaseType(field.type).name.value;

    const argNames = field.arguments.map(a => a.name.value);
    let argsStr = 'args';
    if (argNames.length > 0) {
      argsStr = `{ ${argNames.join(', ')} }`;
    }

    if (directive) {
      const generator = generators[directive.name.value];
      const options = argumentsToObject(directive.arguments);
      return generator(
        { TypeName, typeName, fieldName, argsStr, ReturnTypeName },
        options
      );
    }

    // XXX: chances are we'll want to change this but this works for now
    const isArrayField = field.type.kind === 'ListType';
    const generator = isArrayField
      ? generators.belongsToMany
      : generators.belongsTo;
    return generator(
      { TypeName, typeName, fieldName, argsStr, ReturnTypeName },
      { as: fieldName }
    );
  });
}
