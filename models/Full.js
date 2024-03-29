const seq = require('../db/mysql')
const { TEXT, INTEGER, STRING } = require('sequelize');
const { transferNum } = require('../libs/utils');

const Full = seq.define('full', {
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
    allowNull: false,
    set (val) {
      return this.setDataValue('play_count', transferNum(val));
    },
  },

  popup_count: {
    type: INTEGER,
    allowNull: false,
    set (val) {
      return this.setDataValue('popup_count', transferNum(val));
    },
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

module.exports = Full;
