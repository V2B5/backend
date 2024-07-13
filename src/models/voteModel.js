const { Sequelize } = require('sequelize');
const { SequelizeDB } = require('../utils/database');
const User = require('./userModel');
const EstablishmentReview = require('./establishmentReviewModel');
const EventReview = require('./eventReviewModel');

const Vote = SequelizeDB.define('Vote', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idUtilizador: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  idEstabelecimento: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: EstablishmentReview,
      key: 'id'
    }
  },
  idEvento: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: EventReview,
      key: 'id'
    }
  },
  tipo: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});

Vote.belongsTo(User, { foreignKey: 'idUtilizador' });

module.exports = Vote;
