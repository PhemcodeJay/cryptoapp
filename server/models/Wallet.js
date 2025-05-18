
/server/models/Wallet.js

js

Copy code

const { DataTypes } = require('sequelize'); const sequelize = require('../sequelize'); const Wallet = sequelize.define('Wallet', { userId: { type: DataTypes.INTEGER, allowNull: false }, address: { type: DataTypes.STRING, allowNull: false }, chain: { type: DataTypes.STRING, allowNull: false } }); module.exports = Wallet; 

