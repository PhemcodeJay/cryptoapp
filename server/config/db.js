const { Sequelize } = require('sequelize');
require('dotenv').config();

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE
} = process.env;

if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
  throw new Error('❌ Missing required MySQL environment variables in .env');
}

const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  dialect: 'mysql',
  logging: false, // set to console.log to enable SQL logs
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

const syncModels = async () => {
  try {
    await sequelize.sync();
    console.log('✅ Models synced successfully.');
  } catch (error) {
    console.error('❌ Error syncing models:', error);
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncModels
};
