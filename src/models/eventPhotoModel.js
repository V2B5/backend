const { Sequelize } = require('sequelize');
const { SequelizeDB } = require('../utils/database');
const Event = require('./eventModel');
const User = require('./userModel');

const EventPhoto = SequelizeDB.define('EventPhoto', {
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

EventPhoto.belongsTo(Event, { foreignKey: 'idEvento', as: 'evento' });
EventPhoto.belongsTo(User, { foreignKey: 'idCriador', as: 'criador' });
EventPhoto.belongsTo(User, { foreignKey: 'idAdmin', as: 'admin' });

module.exports = EventPhoto;