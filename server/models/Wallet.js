const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');
const User = require('./User');

const Wallet = sequelize.define('Wallet', {
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  address: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  chain: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  label: {
    type: DataTypes.STRING(100),
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
  tableName: 'wallets', // or 'wallet_balances' if matching SQL table name
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'chain', 'address'],
      name: 'unique_user_chain_address',
    },
  ],
});

// Associations
Wallet.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Wallet, { foreignKey: 'userId' });

module.exports = Wallet;
