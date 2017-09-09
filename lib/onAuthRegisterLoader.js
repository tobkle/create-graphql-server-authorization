'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onAuthRegisterLoader = onAuthRegisterLoader;

var _dataloader = require('dataloader');

var _dataloader2 = _interopRequireDefault(_dataloader);

var _createGraphqlServerFindByIds = require('create-graphql-server-find-by-ids');

var _createGraphqlServerLogging = require('create-graphql-server-logging');

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * similiar to authLog, registers dataloader on successfull authorization
 * and doesn't throw exception in error case  
 * @public
 * @param {string} resolver - log name of a resolver
 * @param {string} mode - crud operation name
 * @param {object} me - current user
 * @param {object} that - it is the 'this' context from a model's constructor
 * @return {Object} return - Object with two functions
 * @property {function} registerLoader - registers the dataloader in the model
 * @property {function} debug - debug() function
 * @property {function} error - error() function
 * }
 */

function onAuthRegisterLoader() {
  var resolver = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var me = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var that = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  // store the 'this' context of a model's constructor
  var model = that;

  // procedure like in authLog
  var logFilename = (0, _createGraphqlServerLogging.getLogFilename)();
  var log = (0, _createGraphqlServerLogging.logger)(logFilename);

  var makeMessage = function makeMessage(message) {
    return 'Authorize ' + mode + ' \'' + resolver + '\' with user \'' + (me.username ? me.username : _constants.NO_USER) + '\' ' + message;
  };

  return {
    registerLoader: function registerLoader(authQuery) {
      model.authorizedLoader = new _dataloader2.default(function (ids) {
        return (0, _createGraphqlServerFindByIds.findByIds)(model.collection, ids, authQuery);
      });
      var resultMessage = 'registered authorizedLoader successfully';
      log.debug(resultMessage);
      return resultMessage;
    },

    debug: function debug(message) {
      var resultMessage = makeMessage(message);
      log.debug(resultMessage);
      return resultMessage;
    },

    error: function error(message) {
      var resultMessage = makeMessage(message);
      log.error(resultMessage);
      return resultMessage;
    }
  };
}