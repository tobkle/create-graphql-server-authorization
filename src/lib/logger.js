// @flow

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
  return new winston.Logger({
    transports: [
      new winston.transports.File({
        level: 'debug',
        filename,
        handleExceptions: true,
        json: false,
        maxsize: 5 * 1024 * 1024, // 5MB
        maxFiles: 5,
        colorize: false,
        timestamp,
        formatter
      }),

      new winston.transports.Console({
        level: 'debug',
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
