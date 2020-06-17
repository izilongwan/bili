module.exports = {
  MYSQL_CONF: {
    conf: ['bili', 'root', '666666'],
    base: {
      port: 3306,
      host: 'localhost',
      dialect: 'mysql',
      dialectOptions: {
        dateStrings: true,
        typeCast: true
      }
    }
  },

  REDIS_CONF: ['6379', '127.0.0.1'],

  MONGO_CONF: 'mongodb://127.0.0.1:27017/'
}
