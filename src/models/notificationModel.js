const { Sequelize } = require('sequelize');
const { SequelizeDB } = require('../utils/database');
const User = require('./userModel');

const Notification = SequelizeDB.define('Notification', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idUtilizador: {
        type: Sequelize.INTEGER,
        allowNull: false
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
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    }, {
    freezeTableName: true,
    timestamps: false
    });

    Notification.belongsTo(User, { foreignKey: 'idUtilizador', as: 'utilizador' });

module.exports = Notification;