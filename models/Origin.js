const seq = require('../db/mysql')
const { TEXT, INTEGER, STRING } = require('sequelize');

const ORIGIN = seq.define('origin', {
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

  play_count: {
    type: INTEGER,
    allowNull: false
  },

  popup_count: {
    type: INTEGER,
    allowNull: false
  },

  up_name: {
    type: STRING,
    allowNull: false
  },

  up_href: {
    type: STRING,
    allowNull: false
  },

  score: {
    type: INTEGER,
    allowNull: false
  },

  tags: {
    type: TEXT,
    allowNull: false,
    set (val) {
      return this.setDataValue('tags', JSON.stringify(val));
    },
    get (val) {
      const ret = JSON.parse(this.getDataValue(val));

      return [].concat(ret);
    }
  },

  status: {
    type: INTEGER,
    defaultValue: 1
  }
}, {
  underscored: true
})

module.exports = ORIGIN;
