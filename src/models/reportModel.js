const { Sequelize } = require('sequelize');
const { SequelizeDB } = require('../utils/database');
const User = require('./userModel');
const EventReview = require('./eventReviewModel');

const Report = SequelizeDB.define('Report', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idCriador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    idAvaliacaoEvento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'EventReview',
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
    estado: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
}, {
    freezeTableName: true,
    timestamps: false
});

Report.belongsTo(User, { foreignKey: 'idCriador', as: 'criador' });
Report.belongsTo(EventReview, { foreignKey: 'idAvaliacaoEvento', as: 'avaliacaoEvento' });
Report.belongsTo(User, { foreignKey: 'idAdmin', as: 'admin' });

module.exports = Report;