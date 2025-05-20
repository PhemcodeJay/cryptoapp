const { Sequelize } = require('sequelize');
require('dotenv').config();

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  DB_LOGGING
} = process.env;

if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
  throw new Error('❌ Missing required MySQL environment variables in .env');
}

if (!MYSQL_PASSWORD) {
  console.warn('⚠️ MYSQL_PASSWORD is not set, connecting without password');
}

const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD || '', {
  host: MYSQL_HOST,
  dialect: 'mysql',
  logging: DB_LOGGING === 'true' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
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

const syncModels = async (options = {}) => {
  try {
    await sequelize.sync(options);
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
