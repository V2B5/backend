const { Sequelize } = require('sequelize');
const { SequelizeDB } = require('../utils/database');

const Post = SequelizeDB.define('Post', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  }
},
{
  freezeTableName: true,
  timestamps: false
});

module.exports = Post;