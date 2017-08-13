import winston from "winston";

/*
 * Creates a logger based on winston
 * @param {object} me
 * @return {boolean} logger
 */

winston.emitErrs = true;

// create timestamps in local format
const timestamp = function() {
  return new Date(Date.now()).toLocaleString();
};

// format the output messages
const formatter = function(options) {
  return (
    options.timestamp() +
    " " +
    (options.level === "error" ? " " + options.level.toUpperCase() : "") +
    " " +
    (options.message ? options.message : "") +
    (options.meta && Object.keys(options.meta).length
      ? "\n\t" + JSON.stringify(options.meta)
      : "")
  );
};

// creates the logger, which outputs messages to file and to console
const logger = function(filename) {
  return new winston.Logger({
    transports: [
      new winston.transports.File({
        level: "debug",
        filename: filename,
        handleExceptions: true,
        json: false,
        maxsize: 5 * 1024 * 1024, //5MB
        maxFiles: 5,
        colorize: false,
        timestamp: timestamp,
        formatter: formatter
      }),

      new winston.transports.Console({
        level: "debug",
        handleExceptions: true,
        json: false,
        colorize: true,
        timestamp: timestamp,
        formatter: formatter
      })
    ],

    exitOnError: false
  });
};

// define an output stream
const stream = {
  write: function(message, encoding) {
    logger.debug(message);
  }
};

logger.stream = stream;

module.exports = logger;
