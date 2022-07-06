const seq = require('../db/mysql')
const { TEXT, INTEGER, STRING } = require('sequelize');
const { PAGE_ELEMENT } = require('../config');

const PageElement = seq.define('page_element', {
  field: {
    type: STRING,
    allowNull: false
  },

  text: {
    type: STRING,
    allowNull: false
  },

  url: {
    type: STRING,
    allowNull: false,
    defaultValue: '',
  },

  evalStr: {
    type: TEXT,
    allowNull: false,
    defaultValue: '',
  },

  originEvalStr: {
    type: TEXT,
    allowNull: false,
    defaultValue: '',
  },

  status: {
    type: INTEGER,
    defaultValue: 1
  }
}, {
  underscored: true
})

;(() => {
  setTimeout(async () => {
    const count = await PageElement.count()

    if (count > 0) {
      return
    }

    for (const item of PAGE_ELEMENT) {
      await PageElement.create(item)
    }
  }, 1000 * 1);
})();

module.exports = PageElement;
