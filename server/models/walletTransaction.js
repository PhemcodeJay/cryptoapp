const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');
const Wallet = require('./Wallet');

const WalletTransaction = sequelize.define('WalletTransaction', {
  walletId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'wallet_id',
    references: {
      model: 'wallets',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  txHash: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
    field: 'tx_hash',
    comment: 'Blockchain transaction hash if applicable',
  },
  type: {
    type: DataTypes.ENUM('deposit', 'withdrawal', 'transfer', 'trade'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(36, 18),
    allowNull: false,
  },
  symbol: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'Asset symbol, e.g., BTC, ETH, USDT',
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    allowNull: false,
    defaultValue: 'pending',
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional transaction details in JSON format',
  },
}, {
  tableName: 'wallet_transactions',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['wallet_id'] },
    { fields: ['tx_hash'] },
    { fields: ['timestamp'] },
  ],
});

// Associations
WalletTransaction.belongsTo(Wallet, {
  foreignKey: 'wallet_id',
  onDelete: 'CASCADE',
});
Wallet.hasMany(WalletTransaction, {
  foreignKey: 'wallet_id',
});

module.exports = WalletTransaction;
