const { MYSQL_CONF } = require('../config/db');
const Sequelize = require('sequelize');
const { conf, base } = MYSQL_CONF;

const seq = new Sequelize(...conf, base);

seq
  .sync()
  .then(() => console.log('MYSQL connect: OK'))
  .catch((err) => console.log(`MYSQL connect error: ${ err }`));

module.exports = seq;
