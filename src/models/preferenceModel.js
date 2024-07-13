const { Sequelize } = require('sequelize');
const { SequelizeDB } = require('../utils/database');
const User = require('./userModel');
const Area = require('./areaModel');
const Subarea = require('./subareaModel');

const Preference = SequelizeDB.define('Preference', {
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
    idArea: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'Area',
            key: 'id'
        }
    },
    idSubarea: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'Subarea',
            key: 'id'
        }
    },
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['idUtilizador', 'idArea', 'idSubarea']
        }
    ]
});

Preference.belongsTo(User, { foreignKey: 'idUtilizador', as: 'utilizador' });
Preference.belongsTo(Area, { foreignKey: 'idArea', as: 'area' });
Preference.belongsTo(Subarea, { foreignKey: 'idSubarea', as: 'subarea' });

module.exports = Preference;