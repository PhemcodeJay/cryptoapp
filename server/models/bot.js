const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');
const User = require('./User');

const Bot = sequelize.define('Bot', {
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  exchange: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'binance_futures',
  },
  symbol: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  timeframe: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: '1h',
  },
  strategy: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'ma_macd_rsi_stoch_vol',
  },
  minInvestment: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 5.00,
  },
  takeProfitPct: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 50.00,
  },
  stopLossPct: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 10.00,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'bots',
  timestamps: true,
});

Bot.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Bot, { foreignKey: 'userId' });

module.exports = Bot;
