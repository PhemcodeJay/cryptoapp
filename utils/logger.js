const path = require('path');
const fs = require('fs');
const winston = require('winston');

// Ensure log directory exists
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    }),
  ],
});

// Simple helper to log structured errors
const logFile = path.join(__dirname, '../logs/error.log');

const logError = (label, error) => {
  const message = `[${new Date().toISOString()}] ${label}: ${error.stack || error}\n`;
  console.error(message); // ensure it logs to console too
  fs.appendFileSync(logFile, message);
};

module.exports = { logger, logError };
