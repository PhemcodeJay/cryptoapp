const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');
const Bot = require('./Bot');

const BotTrade = sequelize.define('BotTrade', {
  botId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'bot_id',
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
    field: 'entry_price',
  },
  exitPrice: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: true,
    field: 'exit_price',
  },
  quantity: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
  },
  profitUsdt: {
    type: DataTypes.DECIMAL(12, 4),
    allowNull: true,
    field: 'profit_usdt',
  },
  status: {
    type: DataTypes.ENUM('open', 'closed'),
    allowNull: false,
    defaultValue: 'open',
  },
  openedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'opened_at',
    defaultValue: DataTypes.NOW,
  },
  closedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'closed_at',
  },
}, {
  tableName: 'bot_trades',
  timestamps: false,
  underscored: true,
});

// Associations
BotTrade.belongsTo(Bot, { foreignKey: 'bot_id', onDelete: 'CASCADE' });
Bot.hasMany(BotTrade, { foreignKey: 'bot_id' });

module.exports = BotTrade;
