const { Sequelize } = require('sequelize');
const { SequelizeDB } = require('../utils/database');
const Area = require('./areaModel');

const Subarea = SequelizeDB.define('Subarea', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idArea: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Area',
      key: 'id'
    }
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  },
  {
    freezeTableName: true,
    timestamps: false
  });

Subarea.belongsTo(Area, {foreignKey: 'idArea'});

module.exports = Subarea;
  
