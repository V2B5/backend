const { Sequelize } = require('sequelize');
const { SequelizeDB } = require('../utils/database');

const Area = SequelizeDB.define('Area', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: Sequelize.STRING,
  iconeId: Sequelize.INTEGER,
}, 
  
  
{
  freezeTableName: true,
  timestamps: false
});


module.exports = Area;

