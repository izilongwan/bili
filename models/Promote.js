const seq = require('../db/mysql')
const { TEXT, INTEGER, STRING } = require('sequelize');

const Promote = seq.define('promote', {
  img: {
    type: STRING,
    allowNull: false
  },

  href: {
    type: TEXT,
    allowNull: false
  },

  title: {
    type: STRING,
    allowNull: false
  },

  up_href: {
    type: STRING,
    allowNull: false
  },

  up_name: {
    type: STRING,
    allowNull: false
  },

  status: {
    type: INTEGER,
    defaultValue: 1
  }
}, {
  underscored: true
})

module.exports = Promote;
