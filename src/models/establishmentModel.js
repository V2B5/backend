const { Sequelize } = require('sequelize');
const { SequelizeDB } = require('../utils/database');
const Area = require('./areaModel');
const Subarea = require('./subareaModel');
const Post = require('./postModel');
const User = require('./userModel');

const Establishment = SequelizeDB.define('Establishment', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  idArea: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Area',
      key: 'id'
    }
  },
  idSubarea: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Subarea',
      key: 'id'
    }
  },
  idPosto: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Post',
      key: 'id'
    }
  },
  morada: {
    type: Sequelize.STRING,
    allowNull: true
  },
  descricao: {
    type: Sequelize.STRING(1000),
    allowNull: false
  },
  foto: { 
    type: Sequelize.STRING,
    allowNull: true
  },
  telemovel : {
    type: Sequelize.STRING,
    allowNull: true
  },
  email : {
    type: Sequelize.STRING,
    allowNull: true
  },
  idAdmin: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  idCriador: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  estado: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
},
{
  freezeTableName: true,
  timestamps: false
});

Establishment.belongsTo(Area, {foreignKey: 'idArea'});
Establishment.belongsTo(Subarea, {foreignKey: 'idSubarea'});
Establishment.belongsTo(Post, {foreignKey: 'idPosto'});
Establishment.belongsTo(User, { as: 'admin', foreignKey: 'idAdmin' });
Establishment.belongsTo(User, { as: 'criador', foreignKey: 'idCriador' });

module.exports = Establishment;