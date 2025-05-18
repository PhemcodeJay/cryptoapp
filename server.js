require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const botRoutes = require('./routes/botRoutes');
const sequelize = require('./sequelize');
const passport = require('passport');
const initializeJwtStrategy = require('./middleware/passportJwtStrategy');
const flash = require('connect-flash');
const { testConnection, syncModels, closeAllConnections, getTenantDb } = require('./config/db'); // Import functions from db.js
const rateLimiter = require('./middleware/rateLimiter');
const tenantMiddleware = require('./middleware/tenantMiddleware');
const authenticateUser = require('./middleware/authenticateUser');
const errorLogger = require('./middleware/errorLogger');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/bot', botRoutes);

sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running');
  });
});

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});