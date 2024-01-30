import path from "path";
import winston from "winston";

import config from "$config.js";

/** Error logging file path. */
const errorLog = path.join(config.path.log, "error.log");

/** Combined logging file path. */
const combinedLog = path.join(config.path.log, "combined.log");

/**
 * Logger instance. Use it for logging.
 *
 * @public
 */
const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: errorLog, level: "error" }),
        new winston.transports.File({ filename: combinedLog })
    ]
});

export default logger;
