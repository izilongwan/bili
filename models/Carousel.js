const seq = require('../db/mysql')
const { TEXT, INTEGER, STRING } = require('sequelize');

const Carousel = seq.define('carousel', {
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

  status: {
    type: INTEGER,
    defaultValue: 1
  }
}, {
  underscored: true
})

module.exports = Carousel;
