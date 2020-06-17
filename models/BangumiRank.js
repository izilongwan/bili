const seq = require('../db/mysql')
const { TEXT, INTEGER, STRING } = require('sequelize');

const Bangumi = seq.define('bangumi_rank', {
  img: {
    type: STRING,
    allowNull: false
  },

  href: {
    type: STRING,
    allowNull: false
  },

  title: {
    type: STRING,
    allowNull: false
  },

  tip: {
    type: STRING,
    allowNull: false
  },

  play_count: {
    type: INTEGER,
    allowNull: false
  },

  fav_count: {
    type: INTEGER,
    allowNull: false
  },

  popup_count: {
    type: INTEGER,
    allowNull: false
  },

  tags: {
    type: TEXT,
    allowNull: false,
    set (val) {
      return this.setDataValue('tags', JSON.stringify(val));
    }
  },

  score: {
    type: INTEGER,
    allowNull: false
  },

  status: {
    type: INTEGER,
    defaultValue: 1
  }
}, {
  underscored: true
})

module.exports = Bangumi;
