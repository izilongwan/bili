module.exports = {
  MYSQL_CONF: {
    conf: ['bili_manager', 'izilongwan', 'izilongwan'],
    // conf: ['bili_manager', 'root', 'izilongwan'],
    base: {
      port: 3306,
      host: 'db4free.net',
      // host: 'localhost',
      dialect: 'mysql',
      dialectOptions: {
        dateStrings: true,
        typeCast: true
      },
      pool: {
        max: 50,
        min: 0,
        idle: 10000
      },
      timezone: '+08:00' //东八时区
    }
  },

  REDIS_CONF: ['6379', '127.0.0.1'],

  MONGO_CONF: 'mongodb://127.0.0.1:27017/'
}
