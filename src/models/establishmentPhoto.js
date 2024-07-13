const { Sequelize } = require('sequelize');
const { SequelizeDB } = require('../utils/database');
const User = require('./userModel');
const Establishment = require('./establishmentModel');

const EstablishmentPhoto = SequelizeDB.define('EstablishmentPhoto', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idEstabelecimento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
        model: 'Establishment',
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
    foto: {
        type: Sequelize.STRING,
        allowNull: false
    },
    estado : {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    freezeTableName: true,
    timestamps: false
  });

EstablishmentPhoto.belongsTo(Establishment, { foreignKey: 'idEstabelecimento', as: 'estabelecimento' });
EstablishmentPhoto.belongsTo(User, { foreignKey: 'idCriador', as: 'criador' });
EstablishmentPhoto.belongsTo(User, { foreignKey: 'idAdmin', as: 'admin' });

module.exports = EstablishmentPhoto;