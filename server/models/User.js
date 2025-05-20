const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize'); // destructure sequelize here

const User = sequelize.define('User', {
  walletAddress: {
    type: DataTypes.STRING(42), // Ethereum address length (0x + 40 hex)
    allowNull: false,
    unique: true,
    validate: {
      is: /^0x[a-fA-F0-9]{40}$/, // Basic Ethereum address regex validation
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
    defaultValue: 'active',
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user',
  },
  profileComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  tableName: 'users',
  timestamps: true,
  paranoid: true, // enables soft deletes via deletedAt
});

module.exports = User;
