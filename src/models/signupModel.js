const { Sequelize } = require('sequelize');
const { SequelizeDB } = require('../utils/database');
const User = require('./userModel');
const Event = require('./eventModel');


const SignUp = SequelizeDB.define('SignUp', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idEvento: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Event',
      key: 'id'
    }
  },
  idUtilizador: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  idAdmin: {
    type: Sequelize.INTEGER,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  data: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  estado: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
}, 
{
  freezeTableName: true,
  timestamps: false
});

SignUp.belongsTo(Event, { foreignKey: 'idEvento', as: 'evento' });
SignUp.belongsTo(User, { foreignKey: 'idUtilizador', as: 'utilizador' });
SignUp.belongsTo(User, { foreignKey: 'idAdmin', as: 'admin' });

module.exports = SignUp;