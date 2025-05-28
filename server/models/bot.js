const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');
const User = require('./User');

const Bot = sequelize.define('Bot', {
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'user_id',
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
    field: 'min_investment',
  },
  takeProfitPct: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 50.00,
    field: 'take_profit_pct',
  },
  stopLossPct: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 10.00,
    field: 'stop_loss_pct',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  },
}, {
  tableName: 'bots',
  timestamps: true,
  underscored: true,
});

// Associations
Bot.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Bot, { foreignKey: 'user_id' });

module.exports = Bot;
