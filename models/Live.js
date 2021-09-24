const seq = require('../db/mysql')
const { TEXT, INTEGER, STRING } = require('sequelize');

const Live = seq.define('live', {
  img: {
    type: STRING,
    allowNull: false
  },

  href: {
    type: TEXT,
    allowNull: false
  },

  live_count: {
    type: STRING,
    allowNull: false
  },

  title: {
    type: STRING,
    allowNull: false
  },

  up_img: {
    type: STRING,
    allowNull: false
  },

  up_name: {
    type: STRING,
    allowNull: false
  },

  tag: {
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

module.exports = Live;
