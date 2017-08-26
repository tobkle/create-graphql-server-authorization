// @flow
/* eslint-disable max-len */

import { isAuthorizeDirectiveDefined } from './isAuthorizeDirectiveDefined';
import { getRoles } from './getRoles';

import { generateAuthCodeModeReadOne } from './generateAuthCodeModeReadOne';
import { generateAuthCodeModeReadMany } from './generateAuthCodeModeReadMany';
import { generateAuthCodeModeCreate } from './generateAuthCodeModeCreate';
import { generateAuthCodeModeUpdate } from './generateAuthCodeModeUpdate';
import { generateAuthCodeModeDelete } from './generateAuthCodeModeDelete';
import { generateCreatedBy } from './generateCreatedBy';
import { generateUpdatedBy } from './generateUpdatedBy';
import { generateAuthRoleDefinition } from './generateAuthRoleDefinition';
import { generateAuthRoleMethod } from './generateAuthRoleMethod';
import { generateBcryptDefinition } from './generateBcryptDefinition';

/**
 * generates authorization code
 * @public
 * @param {string} typeName - the name of the type
 * @param {object} inputSchema - the schema for that type
 * @return {Object} generatedCode - generated code
 * @property {string} generateAuthCodeModeReadOne - code for mode 'readOne'
 * @property {string} generateAuthCodeModeReadMany - code for mode 'readMany'
 * @property {string} generateAuthCodeModeCreate - code for mode 'create'
 * @property {string} generateAuthCodeModeUpdate - code for mode 'update'
 * @property {string} generateAuthCodeModeDelete - code for mode 'delete'
 * @property {string} generateCreatedBy - code for field createdBy
 * @property {string} generateUpdatedBy - code for field updatedBy
 * @property {string} generateAuthRoleDefinition - code for authRole definition
 * @property {string} generateAuthRoleMethod - code for authRole method in type User
 * @property {string} generateBcryptDefinition - code for bcrypt definition in type User
 */

export function generateAuthorizationCode(
  typeName: string = '',
  inputSchema: any = {}
): {
  generateAuthCodeModeReadOne: string,
  generateAuthCodeModeReadMany: string,
  generateAuthCodeModeCreate: string,
  generateAuthCodeModeUpdate: string,
  generateAuthCodeModeDelete: string,
  generateCreatedBy: string,
  generateUpdatedBy: string,
  generateAuthRoleDefinition: string,
  generateAuthRoleMethod: string,
  generateBcryptDefinition: string
} {
  const authorize = isAuthorizeDirectiveDefined(inputSchema);
  const { userRoles, docRoles, roleFieldName } = getRoles(
    authorize,
    inputSchema
  );
  return {
    generateAuthCodeModeReadOne: generateAuthCodeModeReadOne(
      authorize,
      typeName,
      userRoles.readOne,
      docRoles.readOne
    ),
    generateAuthCodeModeReadMany: generateAuthCodeModeReadMany(
      authorize,
      userRoles.readMany,
      docRoles.readMany
    ),
    generateAuthCodeModeCreate: generateAuthCodeModeCreate(
      authorize,
      typeName,
      userRoles.create,
      docRoles.create,
      roleFieldName
    ),
    generateAuthCodeModeUpdate: generateAuthCodeModeUpdate(
      authorize,
      typeName,
      userRoles.update,
      docRoles.update,
      roleFieldName
    ),
    generateAuthCodeModeDelete: generateAuthCodeModeDelete(
      authorize,
      userRoles.delete,
      docRoles.delete
    ),
    generateCreatedBy: generateCreatedBy(authorize, typeName),
    generateUpdatedBy: generateUpdatedBy(authorize, typeName),
    generateAuthRoleDefinition: generateAuthRoleDefinition(authorize, typeName),
    generateAuthRoleMethod: generateAuthRoleMethod(
      authorize,
      typeName,
      roleFieldName
    ),
    generateBcryptDefinition: generateBcryptDefinition(authorize, typeName)
  };
}
