const { Sequelize } = require('sequelize');
const { SequelizeDB } = require('../utils/database');
const Area = require('./areaModel');
const Subarea = require('./subareaModel');
const User = require('./userModel');
const Post = require('./postModel');

const Event = SequelizeDB.define('Event', {
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
  idSubarea: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Subarea',
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
  idAdmin: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'User',
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
  titulo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descricao: {
    type: Sequelize.STRING,
    allowNull: false
  },
  data: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  hora: {
    type: Sequelize.TIME,
    allowNull: false
  },
  morada: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  telemovel : {
    type: Sequelize.STRING,
    allowNull: true
  },
  email : {
    type: Sequelize.STRING,
    allowNull: true
  },
  estado: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  foto : {
    type: Sequelize.STRING,
    allowNull: true
  },
  inscricaoAberta: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
},
{
  tableName: 'Event',
  freezeTableName: true,
  timestamps: false
});

Event.belongsTo(Area, { as: 'area', foreignKey: 'idArea' });
Event.belongsTo(Subarea, { as: 'subarea', foreignKey: 'idSubarea' });
Event.belongsTo(User, { as: 'criador', foreignKey: 'idCriador' });
Event.belongsTo(User, { as: 'admin', foreignKey: 'idAdmin' });
Event.belongsTo(Post, { as: 'posto', foreignKey: 'idPosto' });

module.exports = Event;