const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');
const Bot = require('./Bot');

const BotTrade = sequelize.define('BotTrade', {
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
  side: {
    type: DataTypes.ENUM('buy', 'sell'),
    allowNull: false,
  },
  entryPrice: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
  },
  exitPrice: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: true,
  },
  quantity: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
  },
  profitUsdt: {
    type: DataTypes.DECIMAL(12, 4),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('open', 'closed'),
    allowNull: false,
    defaultValue: 'open',
  },
  openedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  closedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'bot_trades',
  timestamps: false,
});

BotTrade.belongsTo(Bot, { foreignKey: 'botId', onDelete: 'CASCADE' });
Bot.hasMany(BotTrade, { foreignKey: 'botId' });

module.exports = BotTrade;
