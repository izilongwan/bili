const { MYSQL_CONF } = require('../config/db');
const Sequelize = require('sequelize');
const { conf, base } = MYSQL_CONF;

const seq = new Sequelize(...conf, base);

const connect = () => {
  seq
    .sync()
    .then(() => console.log('MYSQL connect: OK'))
    .catch((err) => {
      console.log(`MYSQL connect error: ${ err }`)
      console.log(`======`)
      process.nextTick(() => connect())
    });
}

connect()

module.exports = seq;
