require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpires: '7d',
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    binance: {
        apiKey: process.env.BINANCE_API_KEY,
        secret: process.env.BINANCE_SECRET,
    }
};