const redis = require('redis')
const { REDIS_CONF } = require('../config/db')

const [port, host] = REDIS_CONF

const client = redis.createClient({ port, host })

client
  .on('connect', () => {
    console.log('Redis connected success')
  })
  .on("error", (error) => {
    console.error('Redis connected error', error);
  });

module.exports = client
