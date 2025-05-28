const { sequelize } = require('../sequelize');

// Import models directly (already initialized)
const User = require('./User');
const Wallet = require('./Wallet');
const WalletBalance = require('./WalletBalance');
const WalletTransaction = require('./WalletTransaction');
const Bot = require('./Bot');
const BotTrade = require('./BotTrade');
const BotSignal = require('./BotSignal');
const IndicatorValue = require('./IndicatorValue');

// Define associations here if needed, for example:
BotSignal.belongsTo(Bot, { foreignKey: 'bot_id', onDelete: 'CASCADE' });
Bot.hasMany(BotSignal, { foreignKey: 'bot_id' });

// Add other associations like User->Bot, User->Wallet, etc., here as needed

const Models = {
  User,
  Wallet,
  WalletBalance,
  WalletTransaction,
  Bot,
  BotTrade,
  BotSignal,
  IndicatorValue,
};

module.exports = {
  ...Models,
  sequelize,
};
