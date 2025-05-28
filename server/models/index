const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../sequelize').sequelize; // Your sequelize instance export

// Import models
const User = require('./User');
const Wallet = require('./Wallet');
const WalletBalance = require('./WalletBalance');
const WalletTransaction = require('./WalletTransaction');
const Bot = require('./Bot');
const BotTrade = require('./BotTrade');
const BotSignal = require('./BotSignal');
const IndicatorValue = require('./IndicatorValue');

// Initialize models with sequelize and DataTypes
const Models = {
  User: User(sequelize, DataTypes),
  Wallet: Wallet(sequelize, DataTypes),
  WalletBalance: WalletBalance(sequelize, DataTypes),
  WalletTransaction: WalletTransaction(sequelize, DataTypes),
  Bot: Bot(sequelize, DataTypes),
  BotTrade: BotTrade(sequelize, DataTypes),
  BotSignal: BotSignal(sequelize, DataTypes),
  IndicatorValue: IndicatorValue(sequelize, DataTypes),
};

// Setup associations

// User <-> Wallet
Models.Wallet.belongsTo(Models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
Models.User.hasMany(Models.Wallet, { foreignKey: 'userId' });

// Wallet <-> WalletTransaction
Models.WalletTransaction.belongsTo(Models.Wallet, { foreignKey: 'walletId', onDelete: 'CASCADE' });
Models.Wallet.hasMany(Models.WalletTransaction, { foreignKey: 'walletId' });

// User <-> Bot
Models.Bot.belongsTo(Models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
Models.User.hasMany(Models.Bot, { foreignKey: 'userId' });

// Bot <-> BotTrade
Models.BotTrade.belongsTo(Models.Bot, { foreignKey: 'botId', onDelete: 'CASCADE' });
Models.Bot.hasMany(Models.BotTrade, { foreignKey: 'botId' });

// Bot <-> BotSignal
Models.BotSignal.belongsTo(Models.Bot, { foreignKey: 'botId', onDelete: 'CASCADE' });
Models.Bot.hasMany(Models.BotSignal, { foreignKey: 'botId' });

// Bot <-> IndicatorValue
Models.IndicatorValue.belongsTo(Models.Bot, { foreignKey: 'botId', onDelete: 'CASCADE' });
Models.Bot.hasMany(Models.IndicatorValue, { foreignKey: 'botId' });

module.exports = {
  ...Models,
  sequelize,
};
