require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const botRoutes = require('./routes/botRoutes');
const sequelize = require('./sequelize');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/bot', botRoutes);

sequelize.sync().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running');
  });
});
