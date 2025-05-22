const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');
const Bot = require('./Bot');

const BotSignal = sequelize.define('BotSignal', {
  botId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: { model: 'bots', key: 'id' },
    onDelete: 'CASCADE',
  },
  symbol: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  signalType: {
    type: DataTypes.ENUM('buy', 'sell', 'hold'),
    allowNull: false,
  },
  confidence: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  generatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'bot_signals',
  timestamps: false,
  indexes: [
    { fields: ['symbol', 'generatedAt'] }
  ]
});

BotSignal.belongsTo(Bot, { foreignKey: 'botId', onDelete: 'CASCADE' });
Bot.hasMany(BotSignal, { foreignKey: 'botId' });

module.exports = BotSignal;
