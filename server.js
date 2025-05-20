require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const flash = require('connect-flash');

const { sequelize, testConnection } = require('./server/config/db'); // import sequelize instance & testConnection
const { apiLimiter, authLimiter } = require('./server/middleware/rateLimiter'); // destructure middlewares
const errorLogger = require('./server/middleware/errorLogger');

const initializeJwtStrategy = require('./server/middleware/passportJwtStrategy');
initializeJwtStrategy(passport);

const authRoutes = require('./server/routes/authRoutes');
const walletRoutes = require('./server/routes/walletRoutes');
const botRoutes = require('./server/routes/botRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(passport.initialize());
app.use(flash());

app.use(apiLimiter);        // Apply global API rate limiting
app.use(errorLogger);       // Global error logging

app.use('/api/auth', authLimiter, authRoutes);    // More strict limiter for auth routes
app.use('/api/wallets', walletRoutes);
app.use('/api/bot', botRoutes);

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await testConnection();
    await sequelize.sync(); // or your syncModels() if you prefer
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
