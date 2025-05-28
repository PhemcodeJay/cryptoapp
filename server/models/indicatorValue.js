const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');
const Bot = require('./Bot');

const IndicatorValue = sequelize.define('IndicatorValue', {
  botId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'bot_id',
    references: {
      model: 'bots',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  symbol: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  timeframe: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ma20: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: true,
    field: 'ma_20',
  },
  ma200: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: true,
    field: 'ma_200',
  },
  macd: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: true,
  },
  rsi: {
    type: DataTypes.DECIMAL(8, 4),
    allowNull: true,
  },
  stochRsi: {
    type: DataTypes.DECIMAL(8, 4),
    allowNull: true,
    field: 'stoch_rsi',
  },
  volume: {
    type: DataTypes.DECIMAL(18, 4),
    allowNull: true,
  },
}, {
  tableName: 'indicator_values',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['bot_id', 'symbol', 'timeframe', 'timestamp'],
      name: 'unique_indicator',
    },
  ],
});

// Associations
IndicatorValue.belongsTo(Bot, {
  foreignKey: 'bot_id',
  onDelete: 'CASCADE',
});
Bot.hasMany(IndicatorValue, {
  foreignKey: 'bot_id',
});

module.exports = IndicatorValue;
