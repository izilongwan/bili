const seq = require('../db/mysql')
const { TEXT, INTEGER, STRING } = require('sequelize');
const { transferNum } = require('../libs/utils');

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
    allowNull: false,
    set (val) {
      return this.setDataValue('live_count', transferNum(val));
    },
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

module.exports = Live;
