const { DataTypes } = require('sequelize'); 
const sequelize = require('../sequelize'); 
const Trade = sequelize.define('Trade', { userId: DataTypes.INTEGER, symbol: DataTypes.STRING, position: DataTypes.STRING, entryPrice: DataTypes.FLOAT, target: DataTypes.FLOAT, stopLoss: DataTypes.FLOAT, closed: DataTypes.BOOLEAN, }); 
module.exports = Trade; 