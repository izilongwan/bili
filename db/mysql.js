const { MYSQL_CONF } = require('../config/db');
const Sequelize = require('sequelize');
const { conf, base } = MYSQL_CONF;

const seq = new Sequelize(...conf, base);

let t = null

const connect = () => {
  seq
    .sync()
    .then(() => {
      require('../models/CrawlerSettings')
      require('../controllers/api/crawler')
      console.log('----- MYSQL connect: OK -----')
      return null
    })
    .catch((err) => {
      console.log(`----- MYSQL connect error: ${ err } -----`)
      console.log(`----- MYSQL will reconnect after 5s -----`)
      clearTimeout(t);
      t = setTimeout(connect, 1000 * 5);
    });
}

connect()

module.exports = seq;
