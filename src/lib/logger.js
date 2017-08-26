// @flow

import { LOG_LEVEL, LOG_MAX_FILES, LOG_MAX_SIZE } from '../constants';
import winston from 'winston';

winston.emitErrs = true;

/**
 * create timestamps in local format
 * @private
 * @return {string} timestamp - current time stamp in local format
 */

const timestamp = function(): string {
  return new Date(Date.now()).toLocaleString();
};

/**
 * formats the output message string
 * @private
 * @param {object} options - options timestamp, message, meta, level
 * @return {string} message - prepares output message
 */

const formatter = function(options: any): string {
  return (
    options.timestamp() +
    ' ' +
    (options.level === 'error' ? ' ' + options.level.toUpperCase() : '') +
    ' ' +
    (options.message ? options.message : '') +
    (options.meta && Object.keys(options.meta).length
      ? '\n\t' + JSON.stringify(options.meta)
      : '')
  );
};

/**
 * Creates a logger based on winston
 * @public
 * @param {string} filename - log file name
 * @return {function} logger - logger function
 */

export function logger(filename: string): any {
  const logLevel = process.env.npm_package_config_loglevel || LOG_LEVEL;
  const maxSize = process.env.npm_package_config_maxsize || LOG_MAX_SIZE;
  const maxFiles = process.env.npm_package_config_maxfiles || LOG_MAX_FILES;
  return new winston.Logger({
    transports: [
      new winston.transports.File({
        level: logLevel,
        filename,
        handleExceptions: true,
        json: false,
        maxsize: maxSize * 1024 * 1024, // e.g. 5MB
        maxFiles,
        colorize: false,
        timestamp,
        formatter
      }),

      new winston.transports.Console({
        level: logLevel,
        handleExceptions: true,
        json: false,
        colorize: true,
        timestamp,
        formatter
      })
    ],

    exitOnError: false
  });
}
