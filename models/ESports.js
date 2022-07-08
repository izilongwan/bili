const seq = require('../db/mysql')
const { TEXT, INTEGER, STRING } = require('sequelize');
const { transferNum } = require('../libs/utils');

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
    allowNull: false,
    set (val) {
      return this.setDataValue('thumb_count', transferNum(val));
    },
  },

  play_count: {
    type: STRING,
    allowNull: false,
    set (val) {
      return this.setDataValue('play_count', transferNum(val));
    },
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
