require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const flash = require('connect-flash');

const { sequelize, testConnection } = require('./server/config/db');
const { apiLimiter, authLimiter } = require('./server/middleware/rateLimiter');
const errorLogger = require('./server/middleware/errorLogger');
const initializeJwtStrategy = require('./server/middleware/passportJwtStrategy');

// Initialize passport strategies
initializeJwtStrategy(passport);

// Import API routes
const authRoutes = require('./server/routes/authRoutes');
const walletRoutes = require('./server/routes/walletRoutes');
const botRoutes = require('./server/routes/botRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // default for Vite dev server
  credentials: true,
}));
app.use(passport.initialize());
app.use(flash());

// Rate limiting and error logging
app.use(apiLimiter);
app.use(errorLogger);

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/bot', botRoutes);

// Serve React Vite app in production
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDistPath));

  // SPA fallback for React Router routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Example bot execution route (sanitize inputs in production)
const { exec } = require('child_process');
app.post('/api/run-bot', (req, res) => {
  const { strategy, asset, address, signature } = req.body;

  // TODO: Validate signature before proceeding!

  // Simple safe escaping (improve this in production)
  const safeStrategy = strategy.replace(/[^a-zA-Z0-9_-]/g, '');
  const safeAsset = asset.replace(/[^a-zA-Z0-9_-]/g, '');
  const safeAddress = address.replace(/[^a-zA-Z0-9]/g, '');

  exec(`python3 bot.py --strategy ${safeStrategy} --asset ${safeAsset} --wallet ${safeAddress}`, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ message: stderr });
    res.json({ message: stdout || 'Bot executed' });
  });
});

// Start server and connect to DB
const PORT = process.env.PORT || 3001;
const startServer = async () => {
  try {
    await testConnection();
    await sequelize.sync({ alter: true }); // Use migrations for production
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
};

startServer();

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
