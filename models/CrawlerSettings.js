const seq = require('../db/mysql')
const { INTEGER, STRING, BIGINT } = require('sequelize');

const CrawlerSettings = seq.define('crawlerSettings', {
  title: {
    type: STRING,
    allowNull: false,
  },

  field: {
    type: STRING,
    allowNull: false,
  },

  duration: {
    type: BIGINT,
    allowNull: false,
    defaultValue: 1000 * 60 * 60
  },

  switch_type: {
    type: INTEGER,
    defaultValue: 0,
  },

  status: {
    type: INTEGER,
    defaultValue: 0
  }
}, {
  underscored: true
})

module.exports = CrawlerSettings;
