const { Sequelize } = require('sequelize');
const { SequelizeDB } = require('../utils/database');
const Post = require('./postModel');

const User = SequelizeDB.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: Sequelize.STRING,
  descricao: Sequelize.STRING(1000),
  nif: Sequelize.STRING,
  localidade: Sequelize.STRING,
  telemovel: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  palavra_passe: Sequelize.STRING,
  estado: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  foto: Sequelize.STRING,
  id_google: Sequelize.STRING,
  id_facebook: Sequelize.STRING,
  cargo: Sequelize.STRING,
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  isPrimeiroLogin: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  verificationToken: {
    type: Sequelize.STRING,
    allowNull: true
  },
  recoveryToken: {
    type: Sequelize.STRING,
    allowNull: true
  },
  adminId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'User', 
      key: 'id',
      defaultValue: null
    }
  },
  idPosto : {
    type: Sequelize.INTEGER,
    references: {
      model: 'Post',
      key: 'id',
      defaultValue: null
    }
  }
}, 
{
  freezeTableName: true,
  timestamps: false
});

User.belongsTo(Post, {foreignKey: 'idPosto'});

module.exports = User;