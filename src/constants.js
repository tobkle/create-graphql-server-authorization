// @flow

// name of the @authorize directive, which triggers authorization logic
export const AUTHORIZE_DIRECTIVE = 'authorize';

// loglevel, maximum logfile size, maximum number of logfiles
export const LOG_LEVEL = 'debug';
export const LOG_MAX_FILES = 5;
export const LOG_MAX_SIZE = 5;

// constants to read GraphQL Abstract Syntax Tree (AST)
export const FIELD_DEFINITION = 'FieldDefinition';
export const NON_NULL_TYPE = 'NonNullType';
export const STRING_VALUE = 'StringValue';
export const LIST_TYPE = 'ListType';
export const LIST_VALUE = 'ListValue';
export const DIRECTIVE = 'Directive';
export const ARGUMENT = 'Argument';
export const NAME = 'Name';

// valid authorization mode values:
export const CREATE = 'create';
export const READ = 'read'; // which means both: 'readOne' and 'readMany'
export const READ_ONE = 'readOne';
export const READ_MANY = 'readMany';
export const UPDATE = 'update';
export const DELETE = 'delete';

// for the role definitions
export const USER_ROLE = 'userRole';
export const DOC_ROLE = 'docRole';
export const AUTH_ROLE = 'authRole';
export const FOR = 'for';
export const THIS = 'this';
export const WORLD = 'world';
export const NO_ROLE = '<no-role>';
export const NO_USER = '<no-user>';
export const NAMED_TYPE = 'NamedType';
export const STRING = 'String';
export const LIST_OF_STRINGS = '[String]';
export const USER_MODEL = 'user';
export const USER = 'User';
export const LIST_OF_USERS = '[User]';
export const ID_FIELD = '_id';
export const ID_SINGULAR = 'Id';
export const ID_PLURAL = 'Ids';

// valid authorization modes
export const MODES = [CREATE, READ, READ_ONE, READ_MANY, UPDATE, DELETE];

// template for default allRoles, to prepare one role
export const CODE_MODES = [CREATE, READ_ONE, READ_MANY, UPDATE, DELETE];
