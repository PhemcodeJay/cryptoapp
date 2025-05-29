const { sequelize } = require('../sequelize');

const User = require('./User');
const Wallet = require('./Wallet');
const WalletBalance = require('./WalletBalance');
const WalletTransaction = require('./WalletTransaction');
const Bot = require('./Bot');
const BotTrade = require('./BotTrade');
const BotSignal = require('./BotSignal');
const IndicatorValue = require('./IndicatorValue');
const AssetAnalysis = require('./AssetAnalysis');

// Associations

// Bot -> BotSignal
BotSignal.belongsTo(Bot, { foreignKey: 'bot_id', onDelete: 'CASCADE' });
Bot.hasMany(BotSignal, { foreignKey: 'bot_id' });

// User -> Bot
Bot.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Bot, { foreignKey: 'user_id' });

// User -> Wallet
Wallet.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Wallet, { foreignKey: 'user_id' });

// Wallet -> WalletBalance
WalletBalance.belongsTo(Wallet, { foreignKey: 'wallet_id', onDelete: 'CASCADE' });
Wallet.hasMany(WalletBalance, { foreignKey: 'wallet_id' });

// Wallet -> WalletTransaction
WalletTransaction.belongsTo(Wallet, { foreignKey: 'wallet_id', onDelete: 'CASCADE' });
Wallet.hasMany(WalletTransaction, { foreignKey: 'wallet_id' });

// Bot -> BotTrade
BotTrade.belongsTo(Bot, { foreignKey: 'bot_id', onDelete: 'CASCADE' });
Bot.hasMany(BotTrade, { foreignKey: 'bot_id' });

// Bot -> IndicatorValue
IndicatorValue.belongsTo(Bot, { foreignKey: 'bot_id', onDelete: 'CASCADE' });
Bot.hasMany(IndicatorValue, { foreignKey: 'bot_id' });

// User -> AssetAnalysis
AssetAnalysis.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(AssetAnalysis, { foreignKey: 'user_id' });

const Models = {
  User,
  Wallet,
  WalletBalance,
  WalletTransaction,
  Bot,
  BotTrade,
  BotSignal,
  IndicatorValue,
  AssetAnalysis,
};

module.exports = {
  ...Models,
  sequelize,
};
