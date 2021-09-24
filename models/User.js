const seq = require('../db/mysql')
const { TEXT, INTEGER, STRING } = require('sequelize');

const User = seq.define('user', {
  account: {
    type: STRING,
    allowNull: false,
  },

  password: {
    type: TEXT,
    allowNull: false,
  },

  status: {
    type: INTEGER,
    defaultValue: 1
  }
}, {
  underscored: true
})

module.exports = User;
