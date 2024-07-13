const { Sequelize } = require('sequelize');
const { SequelizeDB } = require('../utils/database');
const User = require('./userModel');
const Event = require('./eventModel');

const EventReview = SequelizeDB.define('EventReview', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
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
  idEvento: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Event',
      key: 'id'
    }
  },
  estado: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  classificacao: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  data: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  upvotes: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  downvotes: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  idPai: {
  type: Sequelize.INTEGER,
  allowNull: true, // Permitir null para comentários iniciais
  references: {
    model: 'EventReview',
    key: 'id'
  }
},
  comentario: Sequelize.TEXT
}, 
{
  freezeTableName: true,
  timestamps: false
});

EventReview.belongsTo(Event, { foreignKey: 'idEvento', as: 'evento' });
EventReview.belongsTo(User, { foreignKey: 'idUtilizador', as: 'utilizador' });
EventReview.belongsTo(User, { foreignKey: 'idAdmin', as: 'admin' });

module.exports = EventReview;