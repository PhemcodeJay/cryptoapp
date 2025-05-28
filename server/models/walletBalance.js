const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');

const WalletBalance = sequelize.define('WalletBalance', {
  wallet: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  symbol: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  assetClass: {
    type: DataTypes.STRING(50),
    field: 'asset_class',
    allowNull: true,
  },
  change24h: {
    type: DataTypes.FLOAT,
    field: 'change_24h',
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at',
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'updated_at',
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at',
  },
}, {
  tableName: 'wallet_balances',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      fields: ['wallet', 'symbol'],
    },
  ],
});

module.exports = WalletBalance;
