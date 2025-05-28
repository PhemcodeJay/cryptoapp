const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');
const Bot = require('./Bot');

const BotSignal = sequelize.define('BotSignal', {
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
  },
}, {
  tableName: 'bot_signals',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      fields: ['symbol', 'generated_at'],
    },
  ],
});

// Associations
BotSignal.belongsTo(Bot, {
  foreignKey: 'bot_id',
  onDelete: 'CASCADE',
});
Bot.hasMany(BotSignal, {
  foreignKey: 'bot_id',
});

module.exports = BotSignal;
