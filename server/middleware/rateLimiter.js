// config/rateLimiter.js

const rateLimit = require('express-rate-limit');

// Global API Rate Limiter: 1000 requests per 25 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 25 * 60 * 1000, // 25 minutes
  max: 1000, // Limit each IP to 1000 requests per window
  standardHeaders: true, // Send modern RateLimit headers
  legacyHeaders: false,  // Disable legacy X-RateLimit headers
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  handler: (req, res, next, options) => {
    console.warn(`⚠️ Rate limit exceeded: IP ${req.ip} hit the limit`);
    res.status(options.statusCode).json(options.message);
  },
});

// Optional: Specific rate limit for login or auth-sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many login attempts. Please try again after 15 minutes.",
  },
  handler: (req, res, next, options) => {
    console.warn(`🚫 Login rate limit hit: IP ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
};
