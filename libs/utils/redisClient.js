const red = require('../../../db/redis')

exports.redisSet = (key, value, timeout = 60 * 60) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }

  red.set(key, value);
  red.expire(key, timeout);
}

exports.redisGet = (key) => {
  return new Promise((resolve, reject) => {
    red.get(key, (err, value) => {
      if (err) {
        reject(err);
      }

      try {
        resolve(JSON.parse(value));
      } catch (err) {
        resolve(value);
      }
    })
  })
}