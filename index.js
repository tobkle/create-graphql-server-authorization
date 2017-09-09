'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dummyUserContext = require('./lib/dummyUserContext.js');

Object.defineProperty(exports, 'dummyUserContext', {
  enumerable: true,
  get: function get() {
    return _dummyUserContext.dummyUserContext;
  }
});

var _authlog = require('./lib/authlog.js');

Object.defineProperty(exports, 'authlog', {
  enumerable: true,
  get: function get() {
    return _authlog.authlog;
  }
});

var _onAuthRegisterLoader = require('./lib/onAuthRegisterLoader.js');

Object.defineProperty(exports, 'onAuthRegisterLoader', {
  enumerable: true,
  get: function get() {
    return _onAuthRegisterLoader.onAuthRegisterLoader;
  }
});

var _checkAuthDoc = require('./lib/checkAuthDoc.js');

Object.defineProperty(exports, 'checkAuthDoc', {
  enumerable: true,
  get: function get() {
    return _checkAuthDoc.checkAuthDoc;
  }
});

var _fieldContainsUserId = require('./lib/fieldContainsUserId.js');

Object.defineProperty(exports, 'fieldContainsUserId', {
  enumerable: true,
  get: function get() {
    return _fieldContainsUserId.fieldContainsUserId;
  }
});

var _loggedIn = require('./lib/loggedIn.js');

Object.defineProperty(exports, 'loggedIn', {
  enumerable: true,
  get: function get() {
    return _loggedIn.loggedIn;
  }
});

var _protectFields = require('./lib/protectFields.js');

Object.defineProperty(exports, 'protectFields', {
  enumerable: true,
  get: function get() {
    return _protectFields.protectFields;
  }
});

var _queryForRoles = require('./lib/queryForRoles.js');

Object.defineProperty(exports, 'queryForRoles', {
  enumerable: true,
  get: function get() {
    return _queryForRoles.queryForRoles;
  }
});

var _userRoleAuthorized = require('./lib/userRoleAuthorized.js');

Object.defineProperty(exports, 'userRoleAuthorized', {
  enumerable: true,
  get: function get() {
    return _userRoleAuthorized.userRoleAuthorized;
  }
});

var _getCode = require('./generator/getCode.js');

Object.defineProperty(exports, 'getCode', {
  enumerable: true,
  get: function get() {
    return _getCode.getCode;
  }
});

var _getContext = require('./generator/getContext.js');

Object.defineProperty(exports, 'getContext', {
  enumerable: true,
  get: function get() {
    return _getContext.getContext;
  }
});

var _getName = require('./generator/getName.js');

Object.defineProperty(exports, 'getName', {
  enumerable: true,
  get: function get() {
    return _getName.getName;
  }
});

var _getPartials = require('./generator/getPartials.js');

Object.defineProperty(exports, 'getPartials', {
  enumerable: true,
  get: function get() {
    return _getPartials.getPartials;
  }
});

var _getRoles = require('./generator/authorize/getRoles');

Object.defineProperty(exports, 'getRoles', {
  enumerable: true,
  get: function get() {
    return _getRoles.getRoles;
  }
});

var _isAuthorizeDirectiveDefined = require('./generator/authorize/isAuthorizeDirectiveDefined.js');

Object.defineProperty(exports, 'isAuthorizeDirectiveDefined', {
  enumerable: true,
  get: function get() {
    return _isAuthorizeDirectiveDefined.isAuthorizeDirectiveDefined;
  }
});

var _enhanceSchemaForAuthorization = require('./generator/schema/enhanceSchemaForAuthorization.js');

Object.defineProperty(exports, 'enhanceSchemaForAuthorization', {
  enumerable: true,
  get: function get() {
    return _enhanceSchemaForAuthorization.enhanceSchemaForAuthorization;
  }
});
/* eslint-disable max-len */

/*
 * @desc create-graphql-server-authorization
 * @desc provides access to all public functions
 * @public
 * @param {function} dummyUserContext - get user.role
 * @param {function} authlog - how to log
 * @param {function} onAuthRegisterLoader - registers dataloader on successfull authorization
 * @param {function} checkAuthDoc - checks, if authorized for document
 * @param {function} fieldContainsUserId - checks, if field contains user id
 * @param {function} loggedIn - checks, if user logged in
 * @param {function} protectFields - protects fields for authorized users
 * @param {function} queryForRoles - creates authQuery for later data operations
 * @param {function} userRoleAuthorized - checks, if a user's role is authorized
 * @param {function} getCode - generates authorization code for models and resolvers during add-type
 * @param {function} getContext - required for getCode
 * @param {function} getName - required for getCode
 * @param {function} getPartials - required for getCode
 * @param {function} isAuthorizeDirectiveDefined - returns true, if authorization logic is defined
 * @param {function} enhanceSchemaForAuthorization - enhances the schema for authorization
 */

/* to find this path from various places, return this modules absolute path: */
var modulePath = exports.modulePath = __dirname;

/* for the authorization logic */