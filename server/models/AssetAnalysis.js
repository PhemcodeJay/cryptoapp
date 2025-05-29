const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');

const AssetAnalysis = sequelize.define('AssetAnalysis', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  walletId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'wallet_id',
  },
  symbol: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  timeframe: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  rsi: {
    type: DataTypes.DECIMAL(8, 4),
    allowNull: true,
  },
  macd: {
    type: DataTypes.DECIMAL(12, 6),
    allowNull: true,
  },
  stochRsi: {
    type: DataTypes.DECIMAL(8, 4),
    allowNull: true,
    field: 'stoch_rsi',
  },
  bollingerUpper: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: true,
    field: 'bollinger_upper',
  },
  bollingerLower: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: true,
    field: 'bollinger_lower',
  },
  movingAvg20: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: true,
    field: 'moving_avg_20',
  },
  movingAvg200: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: true,
    field: 'moving_avg_200',
  },
  volumeSma: {
    type: DataTypes.DECIMAL(18, 4),
    allowNull: true,
    field: 'volume_sma',
  },
  signalGeneratedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'signal_generated_at',
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'asset_analysis',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      fields: ['wallet_id', 'symbol', 'timeframe'],
      name: 'idx_wallet_symbol_timeframe',
    }
  ],
});

module.exports = AssetAnalysis;
