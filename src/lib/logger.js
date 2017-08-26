// @flow

import winston from 'winston';

winston.emitErrs = true;

/*
 * @desc create timestamps in local format
 * @private
 * @return {string} timestamp - current time stamp in local format
 */
const timestamp = function(): string {
  return new Date(Date.now()).toLocaleString();
};

/*
 * @desc formats the output message string
 * @private
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

/*
 * @desc Creates a logger based on winston
 * @desc file is allowed to have 5 MB size
 * @public
 * @param {object} me - current user
 * @return {boolean} logger - logger function
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
