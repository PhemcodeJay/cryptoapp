// server/middleware/errorLogger.js

const { logError } = require('../../utils/logger');

/**
 * Express error-handling middleware.
 * Logs errors and returns appropriate JSON response based on environment.
 */
const errorLogger = (err, req, res, next) => {
  const context = `${req.method} ${req.originalUrl}`;
  const isDev = process.env.NODE_ENV !== 'production';

  // Always log full error on server
  logError(`Unhandled error in ${context}`, err);

  // In development, send detailed error message
  if (isDev) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: {
        message: err.message,
        stack: err.stack,
      },
    });
  }

  // In production, keep responses minimal
  return res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later.',
  });
};

module.exports = errorLogger;
