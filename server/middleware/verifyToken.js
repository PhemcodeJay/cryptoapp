
// middleware/verifyToken.js
const { verifyToken } = require('../config/auth');
const debug = require('debug')('middleware:verifyToken');

/**
 * Middleware to verify JWT access token from cookie or Authorization header
 */
module.exports = (req, res, next) => {
  // Check for token in Authorization header or cookie
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Decode and verify token
    const decoded = verifyToken(token);
    req.user = decoded; // Attach user data to request
    next();
  } catch (err) {
    debug('❌ Token verification failed:', err.message);

    // Send appropriate error based on cause
    if (err.message === 'Access token expired') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }

    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};
