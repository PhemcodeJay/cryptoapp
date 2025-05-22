require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');

const { sequelize, testConnection } = require('./server/config/db');
const { apiLimiter, authLimiter } = require('./server/middleware/rateLimiter');
const errorLogger = require('./server/middleware/errorLogger');
const initializeJwtStrategy = require('./server/middleware/passportJwtStrategy');

// Initialize passport strategies
initializeJwtStrategy(passport);

// Route imports
const authRoutes = require('./server/routes/authRoutes');
const walletRoutes = require('./server/routes/walletRoutes');
const botRoutes = require('./server/routes/botRoutes');

const app = express();

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(passport.initialize());
app.use(flash());

// Apply rate limiting & error logger early
app.use(apiLimiter);
app.use(errorLogger);

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/bot', botRoutes);

// Serve React SPA static files in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/build');
  app.use(express.static(clientBuildPath));

  // SPA fallback: serve index.html for client routes (React Router)
  app.get([
    '/', '/login', '/register', '/dashboard', '/portfolio',
    '/assets-analysis', '/wallet-connect', '/trading-bot', '/logout'
  ], (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

const { exec } = require("child_process");

app.post("/api/run-bot", (req, res) => {
  const { strategy, asset, address, signature } = req.body;

  // Validate the wallet signature here (future improvement)

  exec(`python3 bot.py --strategy ${strategy} --asset ${asset} --wallet ${address}`, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ message: stderr });
    res.json({ message: stdout || "Bot executed" });
  });
});


// Database connection and server start
const PORT = process.env.PORT || 3001;
const startServer = async () => {
  try {
    await testConnection();
    await sequelize.sync({ alter: true }); // Use alter for dev only
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

// Global error handler (after all routes)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
