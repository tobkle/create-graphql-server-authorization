import cloneDeep from 'lodash.clonedeep';
import includes from 'lodash.includes';
import { lcFirst } from '../util/capitalization';
import { adjustSchemaForAuthorization } from './adjustSchemaForAuthorization';
import { CREATE, READ, USER_LITERAL, USER_MODEL } from '../../constants';
import { isAuthorizeDirectiveDefined } from '../authorize/isAuthorizeDirectiveDefined';

import {
  getBaseType,
  buildTypeDefinition,
  buildField,
  buildValue,
  buildArgument,
  isScalarField,
  buildTypeExtension,
  addPaginationArguments,
  applyCustomDirectives,
  idArgument,
  SCALAR_TYPE_NAMES
} from '../util/graphql';

import {
  DOCUMENT,
  OBJECT_TYPE_DEFINITION,
  INPUT_OBJECT_TYPE_DEFINITION,
  ENUM_TYPE_DEFINITION,
  TYPE_EXTENSION_DEFINITION,
  LIST_TYPE,
  FIELD_DEFINITION,
  NAME
} from 'graphql/language/kinds';

/**
 * enhances the schema by additional fields, required for authorization
 * @public
 * @param {object} inputSchema - the input's schema with all fields
 * @return {object} outputSchema - the enhanced output Schema
 */

export function enhanceSchemaForAuthorization(inputSchema) {
  const outputSchema = cloneDeep(inputSchema);
  const type = outputSchema.definitions[0];
  const TypeName = type.name.value;
  const typeName = lcFirst(TypeName);

  const authorize = isAuthorizeDirectiveDefined(inputSchema);
  if (authorize) {
    const createInputFields = [];
    
    // remove @authorize directive from header
    type.directives = type.directives.filter(directive => 
      directive.name.value !== 'authorize'
    );

    // for type User: add field 'password' for 'create'
    if(TypeName === USER_LITERAL){
      // get the name of the create<Type>Input
      const createInputTypeName = `Create${TypeName}Input`;

      outputSchema
        .definitions.filter(objType =>
          objType.kind === INPUT_OBJECT_TYPE_DEFINITION &&
          objType.name.value === createInputTypeName)
        .forEach(inputType => inputType.fields.push(
          buildField('password', [], 'String!')
        ));
    }

    // for all typeNames with authorization: add 'createdBy'
    type.fields.push(buildField('createdBy', [], USER_LITERAL));

    // for all typeNames with authorization: add 'updatedBy'
    type.fields.push(buildField('updatedBy', [], USER_LITERAL));
  }
  
  return outputSchema;

}
