// @flow

import DataLoader from 'dataloader';
import { findByIds } from './findByIds';
import { logger } from './logger';
import { getLogFilename } from './getLogFilename';

import { NO_USER } from '../constants';

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

export function onAuthRegisterLoader(
  resolver: string = '',
  mode: string = '',
  me?: any = {},
  that?: any = {}
): {
  registerLoader: any,
  debug: any,
  error: any
} {
  // store the 'this' context of a model's constructor
  const model = that;

  // procedure like in authLog
  const logFilename = getLogFilename();
  const log = logger(logFilename);

  const makeMessage = message =>
    `Authorize ${mode} '${resolver}' with user '${me.username
      ? me.username
      : NO_USER}' ${message}`;

  return {
    registerLoader: authQuery => {
      model.authorizedLoader = new DataLoader(ids =>
        findByIds(model.collection, ids, authQuery)
      );
      const resultMessage = `registered authorizedLoader successfully`;
      log.debug(resultMessage);
      return resultMessage;
    },

    debug: message => {
      const resultMessage = makeMessage(message);
      log.debug(resultMessage);
      return resultMessage;
    },

    error: message => {
      const resultMessage = makeMessage(message);
      log.error(resultMessage);
      return resultMessage;
    }
  };
}
