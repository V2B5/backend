  const { Sequelize } = require('sequelize');
  const {SequelizeDB} = require('../utils/database');
  const Establishment = require('./establishmentModel');
  const User = require('./userModel');

  const EstablishmentReview = SequelizeDB.define('EstablishmentReview', {
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
      allowNull: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    idEstabelecimento: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Establishment',
        key: 'id'
      }
    },
    classificacao: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    comentario: {
      type: Sequelize.STRING(1000),
      allowNull: true
    },
    estado: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
  allowNull: true, 
  references: {
    model: 'EstablishmentReview',
    key: 'id'
  }
}
  }, {
    freezeTableName: true,
    timestamps: false
  });

  EstablishmentReview.belongsTo(User, { foreignKey: 'idUtilizador', as: 'utilizador' });
  EstablishmentReview.belongsTo(User, { foreignKey: 'idAdmin', as: 'admin' });
  EstablishmentReview.belongsTo(Establishment, { foreignKey: 'idEstabelecimento', as: 'estabelecimento' });

  module.exports = EstablishmentReview;