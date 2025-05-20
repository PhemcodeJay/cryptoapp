require('dotenv').config(); // Load environment variables

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const flash = require('connect-flash');

const { testConnection, syncModels } = require('./server/config/db');
const sequelize = require('./server/sequelize'); // Assuming sequelize.js sets up basic sequelize instance

// Routes
const authRoutes = require('./server/routes/authRoutes');
const walletRoutes = require('./server/routes/walletRoutes');
const botRoutes = require('./server/routes/botRoutes');

// Middleware
const rateLimiter = require('./server/middleware/rateLimiter');
const tenantMiddleware = require('./server/middleware/tenantMiddleware');
const authenticateUser = require('./server/middleware/authenticateUser');
const errorLogger = require('./server/middleware/errorLogger');

// JWT Strategy
const initializeJwtStrategy = require('./server/middleware/passportJwtStrategy');
initializeJwtStrategy(passport); // Initialize the passport strategy

const app = express();

// Middleware Setup
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(passport.initialize());
app.use(flash());
app.use(rateLimiter);
app.use(errorLogger); // Global error logging middleware

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/bot', botRoutes);

// Start Server After DB Sync
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await testConnection();
    await syncModels();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
  }
};

startServer();
