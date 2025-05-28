const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize'); // destructure sequelize here

const User = sequelize.define('User', {
  walletAddress: {
    type: DataTypes.STRING(42), // Ethereum address length
    allowNull: false,
    unique: true,
    validate: {
      is: /^0x[a-fA-F0-9]{40}$/, // Basic Ethereum address regex
    },
  },
  nonce: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'suspended'),
    allowNull: false,
    defaultValue: 'pending',
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user',
  },
  profileComplete: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  underscored: true, // snake_case fields
});

module.exports = User;
