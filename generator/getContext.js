'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */

exports.getContext = getContext;

var _getRoles2 = require('./authorize/getRoles');

var _isAuthorizeDirectiveDefined = require('./authorize/isAuthorizeDirectiveDefined');

var _capitalization = require('./util/capitalization');

var _utilities = require('../utilities');

var _generatePerField = require('./util/generatePerField');

var _generatePerField2 = _interopRequireDefault(_generatePerField);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * gets context for later template compilation
 * reads schema and determines data context for code replacements
 * @public
 * @param {Object} inputSchema - schema of the type
 * @param {string} User - name of the user model for User model context
 * @param {string} codeType - to distinguish MODEL/RESOLVER runs
 * @return {Object} templateContext - data context for template compilation
 *
 * @property {boolean} authorize - if authorization logic is there
 * @property {boolean} isUserType- if it is the User type
 * @property {string} typeName - name of the type with starting lower case
 * @property {string} TypeName - name of the type with starting upper case
 * @property {string} User - name of the user model
 * @property {Object} userRoles - authorizations matrix for userRole
 * @property {Object} docRoles - authorization matrix for docRole
 * @property {string} firstUserRole - the role for protectFields
 * @property {string} roleField - field name where the userRole is stored
 * @property {array} singularFields - fields array
 * @property {array} paginatedFields - fields array
 * @property {object} schema - schema definition
 */

function getContext() {
  var inputSchema = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var User = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _constants.USER_LITERAL;
  var codeType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _constants.MODEL;

  // for field generation
  // prepare template context for later compilation
  var authorize = (0, _isAuthorizeDirectiveDefined.isAuthorizeDirectiveDefined)(inputSchema);

  // read TypeName out of inputSchema
  var TypeName = inputSchema.definitions[0].name.value;
  var typeName = (0, _capitalization.lcFirst)(TypeName);
  var isUserType = TypeName === User;

  // getting the role definitions out of the @authorize directive

  var _getRoles = (0, _getRoles2.getRoles)(authorize, inputSchema),
      userRoles = _getRoles.userRoles,
      docRoles = _getRoles.docRoles,
      roleFieldName = _getRoles.roleFieldName;

  // get generated fields for resolvers and models


  var _getFields = getFields(inputSchema, codeType),
      singularFields = _getFields.singularFields,
      paginatedFields = _getFields.paginatedFields;

  // prepare protectFields only on for the "User" type as an example
  // roleField shouldn't be empty
  // it checks, if the field is there
  // it takes the first found userRole into the protectFields as a suggestion
  // to the programmer, assuming this is the most important role,
  // with higher authorization (see in README.md)


  var firstUserRole = userRoles[_constants.CREATE][0] ? userRoles[_constants.CREATE][0] : '';
  var roleField = roleFieldName ? '' + roleFieldName : '' + _constants.ROLE_FIELD_DEFAULT;

  // create proper strings for the roles, for template injection
  Object.keys(userRoles).forEach(function (mode) {
    userRoles[mode] = prepareString(userRoles[mode]);
  });
  Object.keys(userRoles).forEach(function (mode) {
    docRoles[mode] = prepareString(docRoles[mode]);
  });

  // this is the returned data context for the later template processing
  return {
    authorize: authorize,
    isUserType: isUserType,
    typeName: typeName,
    TypeName: TypeName,
    User: User,
    userRoles: userRoles,
    docRoles: docRoles,
    firstUserRole: firstUserRole,
    roleField: roleField,
    singularFields: singularFields,
    paginatedFields: paginatedFields
  };
}

/**
 * prepares contexts for singular and paginated field associations
 * @param {Object} inputSchema - schema of the type
 * @param {string} codeType - to distinguish between MODEL/RESOLVER
 * @return {Object} fields - fields for associations
 * @property singularFields - fields for singular associations
 * @property paginatedFields - fields for paginated associations
 */

function getFields(inputSchema, codeType) {
  var type = inputSchema.definitions[0];

  // prepare singular and paginated field arrays for the field templates
  var singularFields = [];
  var paginatedFields = [];

  // generators for the different field association types:
  var generators = {
    // singular association @belongsTo
    belongsTo: function belongsTo(replacements) {
      var field = buildFieldContext(_constants.SINGULAR, replacements, codeType);
      singularFields.push(field);
      return field;
    },


    // paginated association @belongsToMany
    belongsToMany: function belongsToMany(replacements) {
      var typeName = replacements.typeName,
          fieldName = replacements.fieldName;

      var field = buildFieldContext(_constants.PAGINATED, _extends({}, replacements, {
        query: '_id: { $in: ' + typeName + '.' + fieldName + 'Ids || [] }'
      }), codeType);
      paginatedFields.push(field);
      return field;
    },


    // paginated association @hasMany
    hasMany: function hasMany(replacements, _ref) {
      var as = _ref.as;
      var typeName = replacements.typeName;

      var field = buildFieldContext(_constants.PAGINATED, _extends({}, replacements, {
        query: (as || typeName) + 'Id: ' + typeName + '._id'
      }), codeType);
      paginatedFields.push(field);
      return field;
    },


    // paginated association @hasAndBelongsToMany
    hasAndBelongsToMany: function hasAndBelongsToMany(replacements, _ref2) {
      var as = _ref2.as;
      var typeName = replacements.typeName;

      var field = buildFieldContext(_constants.PAGINATED, _extends({}, replacements, {
        query: (as || typeName) + 'Ids: ' + typeName + '._id'
      }), codeType);
      paginatedFields.push(field);
      return field;
    }
  };

  (0, _generatePerField2.default)(type, generators);

  return { singularFields: singularFields, paginatedFields: paginatedFields };
}

/**
 * builds a field's context
 *
 * @param {string} fieldType - SINGULAR or PAGINATED field type
 * @param {object} context - context for the template partial
 * @property {string} typeName - name of the type 
 * @property {string} fieldName - name of the field
 * @property {string} argsStr - arguments of the field
 * @property {string} ReturnTypeName - type to build association with
 * @property {string} query - query for the data access to the referenced type
 * @param {string} codeType - to distinguish between MODEL/RESOLVER
 * @return {Object} field - field for an association
 * @property {string} fieldType - SINGULAR or PAGINATED 
 * @property {string} fieldName - name of the field
 * @property {string} typeName - name of the type with first lower character
 * @property {string} TypeName -  name of the type with first upper character
 * @property {string} ReturnTypeName - name of the type to associate
 * @property {string} argsString - argument string for parameters
 * @property {string} argsFields - fields to pass on to the association
 * @property {string} query - which fields to query during association
 */

function buildFieldContext(fieldType, _ref3, codeType) {
  var typeName = _ref3.typeName,
      fieldName = _ref3.fieldName,
      argsStr = _ref3.argsStr,
      ReturnTypeName = _ref3.ReturnTypeName,
      query = _ref3.query;

  // clone the string
  var argFields = (' ' + argsStr).slice(1);

  // populate some arguments with defaults
  var argsWithDefaultsStr = argsStr.replace('lastCreatedAt', 'lastCreatedAt = 0').replace('limit', 'limit = 10');

  // prepares a fields string to pass on to the referenced type
  if (fieldType === _constants.PAGINATED && argFields !== '') {
    argFields = argFields.replace('{ ', '{ baseQuery, ');
  }

  // returns the build field context
  return {
    fieldType: fieldType || '',
    fieldName: fieldName || '',
    typeName: typeName || '',
    TypeName: (0, _capitalization.ucFirst)(typeName) || '',
    ReturnTypeName: ReturnTypeName || '',
    argsString: argsWithDefaultsStr || '',
    argsFields: argFields || '',
    query: query || ''
  };
}

/**
 * prepare roles for code generator
 * convert array to String value
 * replace " by '
 * @private
 * @param {array} role - name of role
 * @return {string} roleString - role string
 */

function prepareString(role) {
  return JSON.stringify(role).replace(/"/g, "'").replace(/,/g, ', ');
}