'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _kinds = require('graphql/language/kinds');

Object.defineProperty(exports, 'NAME', {
  enumerable: true,
  get: function get() {
    return _kinds.NAME;
  }
});
Object.defineProperty(exports, 'ARGUMENT', {
  enumerable: true,
  get: function get() {
    return _kinds.ARGUMENT;
  }
});
Object.defineProperty(exports, 'NAMED_TYPE', {
  enumerable: true,
  get: function get() {
    return _kinds.NAMED_TYPE;
  }
});
Object.defineProperty(exports, 'LIST_TYPE', {
  enumerable: true,
  get: function get() {
    return _kinds.LIST_TYPE;
  }
});
Object.defineProperty(exports, 'NON_NULL_TYPE', {
  enumerable: true,
  get: function get() {
    return _kinds.NON_NULL_TYPE;
  }
});
Object.defineProperty(exports, 'FIELD_DEFINITION', {
  enumerable: true,
  get: function get() {
    return _kinds.FIELD_DEFINITION;
  }
});
Object.defineProperty(exports, 'OBJECT_TYPE_DEFINITION', {
  enumerable: true,
  get: function get() {
    return _kinds.OBJECT_TYPE_DEFINITION;
  }
});
Object.defineProperty(exports, 'DIRECTIVE', {
  enumerable: true,
  get: function get() {
    return _kinds.DIRECTIVE;
  }
});
Object.defineProperty(exports, 'LIST', {
  enumerable: true,
  get: function get() {
    return _kinds.LIST;
  }
});
Object.defineProperty(exports, 'STRING', {
  enumerable: true,
  get: function get() {
    return _kinds.STRING;
  }
});


// files encoding
var ENCODING = exports.ENCODING = 'utf8';

// templates naming
var TEMPLATE_EXTENSION = exports.TEMPLATE_EXTENSION = '.template';
var TEMPLATES_DIR = exports.TEMPLATES_DIR = 'templates';
var TEMPLATES_MODEL_DIR = exports.TEMPLATES_MODEL_DIR = 'model';
var TEMPLATES_RESOLVER_DIR = exports.TEMPLATES_RESOLVER_DIR = 'resolver';
var TEMPLATES_AUTH_DIR = exports.TEMPLATES_AUTH_DIR = 'auth';
var TEMPLATES_COMMON_DIR = exports.TEMPLATES_COMMON_DIR = 'common';
var TEMPLATES_DEFAULT_DIR = exports.TEMPLATES_DEFAULT_DIR = 'default';
var TEMPLATES_DEFAULT_TEMPLATE = exports.TEMPLATES_DEFAULT_TEMPLATE = 'default';
var MODEL = exports.MODEL = 'model';
var RESOLVER = exports.RESOLVER = 'resolver';
var SCHEMA = exports.SCHEMA = 'schema';

// for field associations
var SINGULAR = exports.SINGULAR = 'singular';
var PAGINATED = exports.PAGINATED = 'paginated';

// name of the @authorize directive, which triggers authorization logic
var AUTHORIZE_DIRECTIVE = exports.AUTHORIZE_DIRECTIVE = 'authorize';

// authorization modes
var CREATE = exports.CREATE = 'create';
var READ = exports.READ = 'read'; // 'read' means both, 'readOne' and 'readMany'
var READ_ONE = exports.READ_ONE = 'readOne';
var READ_MANY = exports.READ_MANY = 'readMany';
var UPDATE = exports.UPDATE = 'update';
var DELETE = exports.DELETE = 'delete';

// valid input modes from @authorize directive
var MODES = exports.MODES = [CREATE, READ, READ_ONE, READ_MANY, UPDATE, DELETE];

// valid output mode for code generator
var CODE_MODES = exports.CODE_MODES = [CREATE, READ_ONE, READ_MANY, UPDATE, DELETE];

// for the role definitions
var AUTH_ROLE = exports.AUTH_ROLE = 'authRole';
var USER_ROLE = exports.USER_ROLE = 'userRole';
var DOC_ROLE = exports.DOC_ROLE = 'docRole';
var FOR = exports.FOR = 'for';
var USER_MODEL = exports.USER_MODEL = 'user';
var STRING_LITERAL = exports.STRING_LITERAL = 'String';
var STRING_LIST = exports.STRING_LIST = '[String]';
var USER_LITERAL = exports.USER_LITERAL = 'User';
var USER_LIST = exports.USER_LIST = '[User]';
var ROLE_FIELD_DEFAULT = exports.ROLE_FIELD_DEFAULT = 'role';

// handling of id
var ID_FIELD = exports.ID_FIELD = '_id';
var ID_SINGULAR = exports.ID_SINGULAR = 'Id';
var ID_PLURAL = exports.ID_PLURAL = 'Ids';

// special roles
var THIS = exports.THIS = 'this';
var WORLD = exports.WORLD = 'world';
var NO_ROLE = exports.NO_ROLE = '<no-role>';
var NO_USER = exports.NO_USER = '<no-user>';

// test directories
var SRC_DIR = exports.SRC_DIR = 'src';
var TEST_DIR = exports.TEST_DIR = '__tests__';
var TEST_GQL_DATA = exports.TEST_GQL_DATA = 'data';
var TEST_CODE = exports.TEST_CODE = 'code';
var TEST_MODEL = exports.TEST_MODEL = 'model';
var TEST_RESOLVER = exports.TEST_RESOLVER = 'resolver';
var TEST_GQL_EXTENSION = exports.TEST_GQL_EXTENSION = '.graphql';
var TEST_EXPECTED_CODE = exports.TEST_EXPECTED_CODE = 'expected';
var TEST_GENERATED_CODE = exports.TEST_GENERATED_CODE = 'generated';
var TEST_MODEL_EXTENSION = exports.TEST_MODEL_EXTENSION = '.js';
var TEST_MODEL_EXTENSION2 = exports.TEST_MODEL_EXTENSION2 = 'model';
var TEST_RESOLVER_EXTENSION = exports.TEST_RESOLVER_EXTENSION = '.js';
var TEST_RESOLVER_EXTENSION2 = exports.TEST_RESOLVER_EXTENSION2 = 'resolver';