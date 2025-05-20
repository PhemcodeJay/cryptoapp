// utils/authCookies.js

const {
  generateToken,
  generateRefreshToken,
  ACCESS_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
} = require('../config/auth');

// Convert '15m', '7d', etc. to milliseconds
const parseMaxAge = (exp) => {
  const match = /^(\d+)([smhd])$/.exec(exp);
  if (!match) {
    console.warn(`⚠️ Invalid expiration format "${exp}", using fallback 1h`);
    return 3600000; // fallback: 1 hour
  }
  const [, num, unit] = match;
  const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return parseInt(num, 10) * units[unit];
};

// Shared cookie options
const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
};

const setAuthCookies = (res, user) => {
  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie('access_token', accessToken, {
    ...baseCookieOptions,
    maxAge: parseMaxAge(ACCESS_EXPIRES_IN),
  });

  res.cookie('refresh_token', refreshToken, {
    ...baseCookieOptions,
    maxAge: parseMaxAge(REFRESH_EXPIRES_IN),
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie('access_token', baseCookieOptions);
  res.clearCookie('refresh_token', baseCookieOptions);
};

module.exports = {
  setAuthCookies,
  clearAuthCookies,
};
