/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
// @flow

// name of the @authorize directive, which triggers authorization logic
const AUTHORIZE_DIRECTIVE = 'authorize';

// constants to read GraphQL Abstract Syntax Tree (AST)
const FIELD_DEFINITION = 'FieldDefinition';
const NON_NULL_TYPE = 'NonNullType';
const STRING_VALUE = 'StringValue';
const LIST_TYPE = 'ListType';
const LIST_VALUE = 'ListValue';
const DIRECTIVE = 'Directive';
const ARGUMENT = 'Argument';
const NAME = 'Name';

// valid authorization mode values:
const CREATE = 'create';
const READ = 'read'; // which means both: 'readOne' and 'readMany'
const READ_ONE = 'readOne';
const READ_MANY = 'readMany';
const UPDATE = 'update';
const DELETE = 'delete';

// for the role definitions
const USER_ROLE = 'userRole';
const DOC_ROLE = 'docRole';
const AUTH_ROLE = 'authRole';
const FOR = 'for';
const THIS = 'this';
const NAMED_TYPE = 'NamedType';
const STRING = 'String';
const LIST_OF_STRINGS = '[String]';
const USER = 'User';
const LIST_OF_USERS = '[User]';
const ID_FIELD = '_id';
const ID_SINGULAR = 'Id';
const ID_PLURAL = 'Ids';

// valid authorization modes
const MODES = [CREATE, READ, READ_ONE, READ_MANY, UPDATE, DELETE];

// template for default allRoles, to prepare one role
const CODE_MODES = [CREATE, READ_ONE, READ_MANY, UPDATE, DELETE];

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
  generateAuthRoleMethod: string
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
      typeName,
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
      typeName,
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
    )
  };
}

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

export function isAuthorizeDirectiveDefined(inputSchema: any): boolean {
  const authorized =
    (inputSchema.definitions &&
      inputSchema.definitions[0] &&
      inputSchema.definitions[0].directives &&
      inputSchema.definitions[0].directives[0] &&
      inputSchema.definitions[0].directives[0].name &&
      inputSchema.definitions[0].directives[0].name.value ===
        AUTHORIZE_DIRECTIVE) ||
    false;

  return authorized;
}

/**
 * get userRoles and docRoles
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {object} inputSchema - type's schema
 * @return {Object}
 * @property {object} userRoles - userRoles object with modes
 * @property {object} docRoles - docRoles object with modes
 * @property {string} roleFieldName - field containing the roles
 * }
 */

function getRoles(authorize: boolean, inputSchema: any) {
  // create empty userRoles and docRoles objects
  // as default values, which are used
  // if there is not @authorize directive
  const userRoles = {};
  const docRoles = {};
  const roleFieldNamesFound = [];
  CODE_MODES.forEach(mode => (userRoles[mode] = []));
  CODE_MODES.forEach(mode => (docRoles[mode] = []));

  // check if there is an @authorize directive
  if (authorize) {
    // then re-determine the userRoles and docRoles
    // from the @authorize tag of the type definition
    const allRolesArguments =
      inputSchema.definitions[0].directives[0].arguments || {};
    const allRoles = getAllRoles(allRolesArguments, inputSchema);
    allRoles.forEach(role => {
      switch (role.type) {
        case USER_ROLE:
          // check, if there is already another userRole field
          if (
            roleFieldNamesFound.length > 0 &&
            role.roleFieldName !== '' &&
            roleFieldNamesFound.indexOf(role.roleFieldName) < 0
          ) {
            // We allow only one field which keeps all userRoles
            throw new Error(`Please adjust type definition, that there is 
              only ONE field, which keeps all user roles. You've tried to 
              add a second userRole field: '${role.roleFieldName}',
              but there is already another userRole field: 
              '${roleFieldNamesFound[0]}' defined.
              Please try instead: '${roleFieldNamesFound[0]}: 
              String @authRole(for: ["otherRole", "${role.roleName}"])'`);
          }
          if (role.roleFieldName !== '') {
            roleFieldNamesFound.push(role.roleFieldName);
          }

          Object.keys(role.modes).forEach(mode => {
            if (role.modes[mode]) {
              userRoles[mode].push(role.roleName);
            }
          });
          break;

        case DOC_ROLE:
          Object.keys(role.modes).forEach(mode => {
            if (role.modes[mode]) {
              docRoles[mode].push(role.roleName);
            }
          });
          break;
      }
    });
  }

  return {
    userRoles,
    docRoles,
    roleFieldName: roleFieldNamesFound.length > 0 ? roleFieldNamesFound[0] : ''
  };
}

/**
 * get the roles from the @authorize directive
 * by reading the input schema's abstract syntax tree
 * to get the roles and their authorized modes
 * @private
 * @param {object} allRolesArguments - AST with role definitions
 * @param {object} inputSchema - the schema of the type
 * @return {array} allRoles - returns the defined roles
 * @example 
 *          @authorize(
 *            admin: ["create", "read", "update", "delete"]
 *            this: ["read", "update", "delete"]
 *          )
 */

function getAllRoles(
  allRolesArguments: any = [],
  inputSchema: any
): Array<any> {
  const allRoles = [];
  // get all Roles of the type's @authorize directives
  // e.g. 'admin', 'this'
  allRolesArguments.forEach(roleArgument => {
    // new role found
    const role = {};

    // check if it is a valid role
    if (
      roleArgument.kind === ARGUMENT &&
      roleArgument.name &&
      roleArgument.name.kind === NAME &&
      roleArgument.name.value &&
      roleArgument.name.value !== ''
    ) {
      // define the new role
      role.name = roleArgument.name.value;

      // determine, if it is a 'userRole' or 'docRole'
      const { roleType, roleName, roleFieldName } = getRoleType(
        role.name,
        inputSchema
      );
      role.type = roleType;
      role.roleName = roleName;
      role.roleFieldName = roleFieldName;

      // create a default object, necessary for missing modes
      role.modes = {};
      CODE_MODES.forEach(mode => (role.modes[mode] = ''));

      // check, if it is a list of values
      if (
        roleArgument.value.kind &&
        roleArgument.value.kind === LIST_VALUE &&
        roleArgument.value.values &&
        roleArgument.value.values.length > 0
      ) {
        // get all authorized modes of the role
        const roleModes = roleArgument.value.values;
        roleModes.forEach(mode => {
          // check, if it is a valid authorization mode
          // e.g. 'create', 'update', 'delete', etc.
          if (
            mode.kind &&
            mode.kind === STRING_VALUE &&
            mode.value &&
            MODES.indexOf(mode.value) >= 0
          ) {
            // it is a valid authorization mode:
            // e.g.   {
            //           name: 'admin',
            //           type: null,      // later: => 'userRole' || 'docRole'
            //           modes: {
            //            create: 'admin',
            //            readOne: 'admin',
            //            readMany: 'admin',
            //            update: 'admin',,
            //            delete: 'admin',
            //        }
            //            'create' = 'admin'
            // special case 'read' means both, 'readOne' and 'readMany'

            if (mode.value === READ) {
              role.modes[READ_ONE] = role.roleName;
              role.modes[READ_MANY] = role.roleName;
            } else {
              role.modes[mode.value] = role.roleName;
            }
          }
        });

        // check, if it is a simple string value:
      } else if (
        roleArgument.name.value.kind &&
        roleArgument.name.value.kind === STRING_VALUE &&
        roleArgument.name.value &&
        MODES.indexOf(roleArgument.name.value) >= 0
      ) {
        //                         'create' = 'admin'
        // special case 'read' means both, 'readOne' and 'readMany'
        if (roleArgument.name.value === READ) {
          role.modes[READ_ONE] = role.roleName;
          role.modes[READ_MANY] = role.roleName;
        } else {
          role.modes[roleArgument.name.value] = role.roleName;
        }
      }
      // add it to the list of roles
      allRoles.push(role);
    }
  });

  return allRoles;
}

/**
 * decide, if the given role is whether 
 * a 'userRole' or a 'docRole'
 *
 * Procedure:
 * 1. Determine, if this field is used as a roleField
 * 2. Check, if this roleField...
 *    a) is of type: String or [String] ==> userRole
 *    b) is of type: User or [User]     ==> docRole
 *    c) roleName = 'this'              ==> docRole
 * 3. If there is no roleField in this type
 *    it must be a userRole
 * 
 * For 1. is a roleField:
 *   read the type's abstract syntax tree
 *   loop over all provided fields,
 *   check, if the field has a directive '@authRole'
 *   and if this authRole is 'for' the provided 'roleName'
 *   or the roleName is the special case 'this'
 *   ==> then it is a roleField
 *
 * For 2. get it's fieldType:
 *   read the type's abstract syntax tree
 *   for the roleField and read it's type
 *   
 *   a) if it is a String or List of Strings,
 *   then the roleType = 'userRole'
 *
 *   b) if it is a User or List of Users (userIds),
 *   then the roleType = 'docType'
 *
 *   c) special case: roleName = 'this'
 *   (it doesn't look for an authRole for 'this')
 *   it means the document's id field is used for this
 *   meaning the role defines the authorizations,
 *   a User has upon his own User document
 *
 * For 3. none of the above applies
 *   so the role must be a userRole
 *   
 * @private
 * @param {string} name - name of the role
 * @param {object} inputSchema - the schema of the type
 * @return {Object} role - role definitions
 * @property {string} roleType - type of the role 'userRole', 'docRole'
 * @property {string} roleName - name of the role
 * @property {string} roleFieldName - field name for the userRole
 */

function getRoleType(name: string = '', inputSchema: any = {}): any {
  // all field definitions of the type
  const allFields = inputSchema.definitions[0].fields;
  let roleType = null;
  let roleName = '';
  let roleFieldName = '';

  // special case 'this'
  if (name === THIS) {
    return {
      roleType: DOC_ROLE,
      roleName: ID_FIELD,
      roleFieldName: ID_FIELD
    };
  }

  // loop over all fields to find authRole directive
  allFields.forEach(field => {
    if (
      field.kind &&
      field.kind === FIELD_DEFINITION &&
      field.name &&
      field.name.kind &&
      field.name.kind === NAME &&
      field.name.value &&
      field.directives &&
      field.directives.length > 0
    ) {
      // 1. check, if it is a roleField
      if (isRoleField(name, field.directives)) {
        // 2. get the type of the field
        const fieldType = getFieldType(field);
        // determine the roleType: 'userRole' || 'docRole'
        // and the roleName for...
        // userRoles: 'admin', 'user',...
        // docRoles: 'authorId', 'coAuthorsIds',...
        switch (fieldType) {
          case STRING:
            // a) userRole
            roleType = USER_ROLE;
            roleName = name;
            roleFieldName = field.name.value;
            break;

          case LIST_OF_STRINGS:
            // a) userRole
            roleType = USER_ROLE;
            roleName = name;
            roleFieldName = field.name.value;
            break;

          case USER:
            // b) docRole
            roleType = DOC_ROLE;
            roleName = `${field.name.value}${ID_SINGULAR}`;
            roleFieldName = field.name.value;
            break;

          case LIST_OF_USERS:
            // b) docRole
            roleType = DOC_ROLE;
            roleName = `${field.name.value}${ID_PLURAL}`;
            roleFieldName = field.name.value;
            break;
        }
      }
    }
  });

  if (roleType) {
    // 2. a) userRole or b) docRole applies
    return {
      roleType,
      roleName,
      roleFieldName
    };
  } else if (name !== '') {
    // 3. none of the above applies, so it must be a userRole
    return {
      roleType: USER_ROLE,
      roleName: name,
      roleFieldName: ''
    };
  }
}

/*
 * is this field a roleField
 * check, if this field has the authRole directive
 * @private
 * @param {string} roleName - name of the role
 * @param {array} fieldDirectives  - AST with field directives
 * @return {boolean} isRoleField - true, if it is a field with a role
 */

function isRoleField(roleName: string, fieldDirectives: any): boolean {
  let found = false;

  // loop over all field directives for an 'authRole'
  fieldDirectives.forEach(fieldDirective => {
    if (
      fieldDirective.kind &&
      fieldDirective.kind === DIRECTIVE &&
      fieldDirective.name &&
      fieldDirective.name.kind === NAME &&
      fieldDirective.name.value === AUTH_ROLE &&
      fieldDirective.arguments &&
      fieldDirective.arguments.length > 0
    ) {
      // loop over all arguments, if it is for our roleName
      // e.g. roleName: 'admin' find @authRole(for: ["admin"])
      fieldDirective.arguments.forEach(fieldDirectiveArgument => {
        // check, if there is a 'for'
        if (
          fieldDirectiveArgument.name &&
          fieldDirectiveArgument.name.kind &&
          fieldDirectiveArgument.name.kind === NAME &&
          fieldDirectiveArgument.name.value &&
          fieldDirectiveArgument.name.value === FOR &&
          fieldDirectiveArgument.value &&
          fieldDirectiveArgument.value.kind
        ) {
          // check, if it is a list value:
          if (
            fieldDirectiveArgument.value.kind === LIST_VALUE &&
            fieldDirectiveArgument.value.values &&
            fieldDirectiveArgument.value.values.length > 0
          ) {
            // loop over all values, if there is one with our roleName
            const fieldRoles = fieldDirectiveArgument.value.values;
            fieldRoles.forEach(fieldRole => {
              // check, if it is our roleName
              if (
                fieldRole.kind &&
                fieldRole.kind === STRING_VALUE &&
                fieldRole.value &&
                fieldRole.value !== '' &&
                fieldRole.value === roleName
              ) {
                // we found it!
                found = true;
              }
            });
            // check, if it is a single value:
          } else if (
            fieldDirectiveArgument.value.kind === STRING_VALUE &&
            fieldDirectiveArgument.value.value &&
            fieldDirectiveArgument.value.value !== '' &&
            fieldDirectiveArgument.value.value === roleName
          ) {
            // we found it!
            found = true;
          }
        }
      });
    }
  });
  return found;
}

/**
 * get the field's type 
 * @private
 * @param {object} field - AST with field definitions
 * @return {type} fieldType - returns the type of the field
 * @example 'role: String'
 * @example 'role: String!'
 * @example 'coauthors: [User]'
 * @example 'coauthors: [User]!'
 * @example 'coauthors: [User!]'
 * @example 'coauthors: [User!]!'
 */

function getFieldType(field: any): string | null {
  // pattern: 'role: String'
  if (
    field.type &&
    field.type.kind &&
    field.type.kind === NAMED_TYPE &&
    field.type.name &&
    field.type.name.kind &&
    field.type.name.kind === NAME &&
    field.type.name.value
  ) {
    if (field.type.name.value === STRING) {
      return STRING;
    }

    if (field.type.name.value === USER) {
      return USER;
    }
  }

  // pattern: 'role: String!'
  if (
    field.type &&
    field.type.kind &&
    field.type.kind === NON_NULL_TYPE &&
    field.type.type &&
    field.type.type.name &&
    field.type.type.name.kind &&
    field.type.type.name.kind === NAME &&
    field.type.type.name.value
  ) {
    if (field.type.type.name.value === STRING) {
      return STRING;
    }

    if (field.type.type.name.value === USER) {
      return USER;
    }
  }

  // pattern: 'coauthors: [User]'
  if (
    field.type &&
    field.type.kind &&
    field.type.kind === LIST_TYPE &&
    field.type.type &&
    field.type.type.name &&
    field.type.type.name.kind &&
    field.type.type.name.kind === NAME &&
    field.type.type.name.value
  ) {
    if (field.type.type.name.value === STRING) {
      return LIST_OF_STRINGS;
    }

    if (field.type.type.name.value === USER) {
      return LIST_OF_USERS;
    }
  }

  // pattern: 'coauthors: [User]!'
  if (
    field.type &&
    field.type.kind &&
    field.type.kind === NON_NULL_TYPE &&
    field.type.type &&
    field.type.type.kind &&
    field.type.type.kind === LIST_TYPE &&
    field.type.type.type &&
    field.type.type.type.kind &&
    field.type.type.type.kind === NAMED_TYPE &&
    field.type.type.type.name &&
    field.type.type.type.name.kind &&
    field.type.type.type.name.kind === NAME &&
    field.type.type.type.name.value
  ) {
    if (field.type.type.type.name.value === STRING) {
      return LIST_OF_STRINGS;
    }

    if (field.type.type.type.name.value === USER) {
      return LIST_OF_USERS;
    }
  }

  // pattern: 'coauthors: [User!]'
  if (
    field.type &&
    field.type.kind &&
    field.type.kind === LIST_TYPE &&
    field.type.type &&
    field.type.type.kind &&
    field.type.type.kind === NON_NULL_TYPE &&
    field.type.type.type &&
    field.type.type.type.kind &&
    field.type.type.type.kind === NAMED_TYPE &&
    field.type.type.type.name &&
    field.type.type.type.name.kind &&
    field.type.type.type.name.kind === NAME &&
    field.type.type.type.name.value
  ) {
    if (field.type.type.type.name.value === STRING) {
      return LIST_OF_STRINGS;
    }

    if (field.type.type.type.name.value === USER) {
      return LIST_OF_USERS;
    }
  }

  // pattern: 'coauthors: [User!]!'
  if (
    field.type &&
    field.type.kind &&
    field.type.kind === NON_NULL_TYPE &&
    field.type.type &&
    field.type.type.kind &&
    field.type.type.kind === LIST_TYPE &&
    field.type.type.type &&
    field.type.type.type.kind &&
    field.type.type.type.kind === NON_NULL_TYPE &&
    field.type.type.type.type &&
    field.type.type.type.type.kind &&
    field.type.type.type.type.kind === NAMED_TYPE &&
    field.type.type.type.type.name &&
    field.type.type.type.type.name.kind &&
    field.type.type.type.type.name.kind === NAME &&
    field.type.type.type.type.name.value
  ) {
    if (field.type.type.type.type.name.value === STRING) {
      return LIST_OF_STRINGS;
    }

    if (field.type.type.type.type.name.value === USER) {
      return LIST_OF_USERS;
    }
  }

  return null;
}

/**
 * prepare roles for code generator
 * convert array to String value
 * replace " by '
 * @private
 * @param {array} role - name of role
 * @return {string} roleString - role string
 */

function prep(role: any): string {
  return JSON.stringify(role).replace(/"/g, "'");
}

/**
 * generate authorization code for mode readOne
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {string} typeName - name of the type
 * @param {string} userRoles - list of userRoles
 * @param {string} docRoles - list of docRoles
 * @return {string} generatedCode - generated code to be injected
 */

function generateAuthCodeModeReadOne(
  authorize: boolean = false,
  typeName: string = '',
  userRoles: Array<string> = [],
  docRoles: Array<string> = []
): string {
  // default code
  let generatedCode = `const { me } = context;
    that.authorizedLoader = new DataLoader(ids => findByIds(this.collection, ids))`;

  // with @authorize directive
  if (authorize) {
    if (typeName === 'user') {
      // User has to come from current class context
      generatedCode = `const { me } = context;
      const authQuery = queryForRoles(me, ${prep(userRoles)}, ${prep(
        docRoles
      )}, { User }, authlog('${typeName} findOneById', 'readOne', me));
      that.authorizedLoader = new DataLoader(ids => findByIds(this.collection, ids, authQuery));`;
    } else {
      // User has to come from this.context.User
      generatedCode = `const { me, User } = context;
      const authQuery = queryForRoles(me, ${prep(userRoles)}, ${prep(
        docRoles
      )}, { User }, authlog('${typeName} findOneById', 'readOne', me));
      that.authorizedLoader = new DataLoader(ids => findByIds(this.collection, ids, authQuery));`;
    }
  }

  return generatedCode;
}

/**
 * generate authorization code for mode readMany
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {string} typeName - name of the type
 * @param {string} userRoles - list of userRoles
 * @param {string} docRoles - list of docRoles
 * @return {string} generatedCode - generated code to be injected
 */

function generateAuthCodeModeReadMany(
  authorize: boolean = false,
  typeName: string = '',
  userRoles: Array<string> = [],
  docRoles: Array<string> = []
) {
  // default code
  let generatedCode = `const finalQuery = {...baseQuery, createdAt: { $gt: lastCreatedAt } };`;

  // with @authorize directive
  if (authorize) {
    generatedCode = `const authQuery = queryForRoles(me, ${prep(
      userRoles
    )}, ${prep(
      docRoles
    )}, { User: this.context.User }, authlog(resolver, 'readMany', me));
      const finalQuery = {...baseQuery, ...authQuery, createdAt: { $gt: lastCreatedAt } };`;
  }

  return generatedCode;
}

/**
 * generate authorization code for mode create
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {string} typeName - name of the type
 * @param {array} userRoles - list of userRoles
 * @param {array} docRoles - list of docRoles
 * @param {string} roleFieldName - field name for the role
 * @return {string} generatedCode - generated code to be injected
 */

function generateAuthCodeModeCreate(
  authorize: boolean = false,
  typeName: string = '',
  userRoles: Array<string> = [],
  docRoles: Array<string> = [],
  roleFieldName?: string = ''
) {
  // default code
  let generatedCode = ``;

  // with @authorize directive
  if (authorize) {
    if (typeName === 'user') {
      // protectFields only on the user type
      // if the fields are filled, than convert them to proper strings,
      // otherwise set them to null
      // take the first userRole into the protectFields as a suggestion
      // to the programmer, assuming this is the most important role,
      // with higher authorization (see in README.md)
      const firstUserRole =
        userRoles.length > 0 && userRoles[0] ? `'${userRoles[0]}'` : ``;
      const roleField = roleFieldName ? `'${roleFieldName}'` : ``;
      generatedCode = `checkAuthDoc(docToInsert, me, ${prep(userRoles)}, ${prep(
        docRoles
      )}, { User: this.context.User }, authlog(resolver, 'create', me));
      docToInsert = protectFields(me, [${firstUserRole}], [${roleField}], docToInsert, { User: this.context.User });`;
    } else {
      // without protectFields
      generatedCode = `checkAuthDoc(docToInsert, me, ${prep(userRoles)}, ${prep(
        docRoles
      )}, { User: this.context.User }, authlog(resolver, 'create', me));`;
    }
  }

  return generatedCode;
}

/**
 * generate authorization code for mode update
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {string} typeName - name of the type
 * @param {array} userRoles - list of userRoles
 * @param {array} docRoles - list of docRoles
 * @param {string} roleFieldName - field name for the role
 * @return {string} generatedCode - generated code to be injected
 */

function generateAuthCodeModeUpdate(
  authorize: boolean = false,
  typeName: string = '',
  userRoles?: Array<string> = [],
  docRoles?: Array<string> = [],
  roleFieldName?: string = ''
) {
  // default code
  let generatedCode = `const finalQuery = {...baseQuery};`;

  // with @authorize directive
  if (authorize) {
    if (typeName === 'user') {
      // protectFields only on the user type
      // if the fields are filled, than convert them to proper strings,
      // otherwise set them to null
      // take the first userRole into the protectFields
      // as a suggestion to the programmer,
      // assuming this is the most important role,
      // with higher authorization (see in README.md)
      const firstUserRole =
        userRoles.length > 0 && userRoles[0] ? `'${userRoles[0]}'` : ``;
      const roleField = roleFieldName ? `'${roleFieldName}'` : ``;
      generatedCode = `const authQuery = queryForRoles(me, ${prep(
        userRoles
      )}, ${prep(
        docRoles
      )}, { User: this.context.User }, authlog(resolver, 'update', me));
      const finalQuery = {...baseQuery, ...authQuery};
      docToUpdate.$set = protectFields(me, [${firstUserRole}], [${roleField}], docToUpdate.$set, { User: this.context.User });`;
    } else {
      // without protectFields
      generatedCode = `const authQuery = queryForRoles(me, ${prep(
        userRoles
      )}, ${prep(
        docRoles
      )}, { User: this.context.User }, authlog(resolver, 'update', me));
      const finalQuery = {...baseQuery, ...authQuery};`;
    }
  }

  return generatedCode;
}

/**
 * generate authorization code for mode delete
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {string} typeName - name of the type
 * @param {string} userRoles - list of userRoles
 * @param {string} docRoles - list of docRoles
 * @return {string} generatedCode - generated code to be injected
 */

function generateAuthCodeModeDelete(
  authorize: boolean = false,
  typeName: string = '',
  userRoles?: Array<string> = [],
  docRoles?: Array<string> = []
) {
  // default code
  let generatedCode = `const finalQuery = {...baseQuery};`;

  // with @authorize directive
  if (authorize) {
    generatedCode = `const authQuery = queryForRoles(me, ${prep(
      userRoles
    )}, ${prep(
      docRoles
    )}, { User: this.context.User }, authlog(resolver, 'delete', me));
      const finalQuery = {...baseQuery, ...authQuery};`;
  }

  return generatedCode;
}

/**
 * generate createdBy method
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {string} typeName - name of the type
 * @return {string} generatedCode - generated code to be injected
 */

function generateCreatedBy(
  authorize: boolean = false,
  typeName: string = ''
): string {
  // default code
  let generatedCode = ``;

  // with @authorize directive: means there must be a User type
  if (authorize) {
    generatedCode = `createdBy(${typeName}, me, resolver) {
    return this.context.User.findOneById(${typeName}.createdById, me, resolver);
  }`;
  }

  return generatedCode;
}

/**
 * generate updatedBy method
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {string} typeName - name of the type
 * @return {string} generatedCode - generated code to be injected
 */

function generateUpdatedBy(
  authorize: boolean = false,
  typeName: string = ''
): string {
  // default code
  let generatedCode = ``;

  // with @authorize directive: means there must be a User type
  if (authorize) {
    generatedCode = `updatedBy(${typeName}, me, resolver) {
    return this.context.User.findOneById(${typeName}.updatedById, me, resolver);
  }`;
  }

  return generatedCode;
}

/**
 * generate updatedBy method
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {string} typeName - name of the type
 * @return {string} generatedCode - generated code to be injected
 */

function generateAuthRoleDefinition(
  authorize: boolean = false,
  typeName: string = ''
): string {
  // default code
  let generatedCode = ``;

  // with @authorize directive: means there must be a User type
  if (authorize && typeName === 'user') {
    generatedCode = `
    this.authRole = User.authRole;`;
  }

  return generatedCode;
}

/**
 * generate authRole() method only in type User
 * @private
 * @param {boolean} authorize - flag for authorization logic
 * @param {string} typeName - name of the type
 * @param {string} roleFieldName - field name, where userRole is stored on type User
 * @return {string} generatedCode - generated code to be injected
 */

function generateAuthRoleMethod(
  authorize: boolean = false,
  typeName: string = '',
  roleFieldName: string = ''
): string {
  // default code
  let generatedCode = ``;

  // with @authorize directive: means there must be a User type
  if (authorize && roleFieldName !== '' && typeName === 'user') {
    generatedCode = `
  static authRole(${typeName}){
    return (${typeName} && ${typeName}.${roleFieldName}) ? ${typeName}.${roleFieldName} : null;
  }
  `;
  }

  return generatedCode;
}
