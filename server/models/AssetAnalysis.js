const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');

// IndicatorValues model
const IndicatorValue = sequelize.define('IndicatorValue', {
  botId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'bot_id',
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
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at',
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'indicator_values',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['bot_id', 'symbol', 'timeframe', 'timestamp']
    }
  ],
});

// BotSignals model
const BotSignal = sequelize.define('BotSignal', {
  botId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'bot_id',
  },
  symbol: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  signalType: {
    type: DataTypes.ENUM('buy', 'sell', 'hold'),
    allowNull: false,
    field: 'signal_type',
  },
  confidence: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  generatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'generated_at',
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'bot_signals',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      fields: ['symbol', 'generated_at']
    }
  ],
});

module.exports = {
  IndicatorValue,
  BotSignal,
};
