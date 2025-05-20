// utils/logger.js

const path = require('path');
const fs = require('fs');
const winston = require('winston');

// Ensure log directory exists
const logDir = path.resolve(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Create Winston logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    }),
  ],
});

// Log to console in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

/**
 * Logs an error with a custom label.
 * @param {string} label - Context or module label.
 * @param {Error|string} error - The error object or message.
 */
const logError = (label, error) => {
  const message = `${label}: ${error?.stack || error}`;
  logger.error(message);
};

module.exports = {
  logger,
  logError,
};
