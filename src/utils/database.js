const { Sequelize } = require('sequelize');
require('dotenv').config({ path: process.env.DOTENV_CONFIG_PATH || '.env' });

const dialectOptions = {};
if (process.env.DB_SSL === 'true') {
  dialectOptions.ssl = {
    require: true,
    rejectUnauthorized: false
  };
}

const SequelizeDB = new Sequelize('ProjetoAI2', 'postgres', 'postgres', {
  host: 'localhost',
  port: '5050',
  dialect: 'postgres',
  logging: false,
  dialectOptions: dialectOptions
});

async function connect() {
  try {
    await SequelizeDB.authenticate();
    console.log('Conexão com o PostgreSQL estabelecida com sucesso.');
  } catch (error) {
    console.error('Não foi possível conectar ao PostgreSQL:', error);
  }
}

module.exports = { SequelizeDB, connect };

