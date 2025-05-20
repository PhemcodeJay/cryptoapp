const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize'); // destructure sequelize for consistency
const User = require('./User'); // import User for association

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
}, {
  tableName: 'wallets',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'chain', 'address'],
      name: 'unique_user_chain_address',
    }
  ],
});

// Define associations
Wallet.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Wallet, { foreignKey: 'userId' });

module.exports = Wallet;
