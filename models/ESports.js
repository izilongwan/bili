const seq = require('../db/mysql')
const { TEXT, INTEGER, STRING } = require('sequelize');

const ESports = seq.define('e_sports', {
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

  thumb_count: {
    type: STRING,
    allowNull: false
  },

  play_count: {
    type: STRING,
    allowNull: false
  },

  duration: {
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

module.exports = ESports;
