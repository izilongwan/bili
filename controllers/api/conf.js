const config = require('../../config')

class Conf {
  getConfig(ctx) {
    ctx.body = config
  }

  ctxConfig(ctx) {
    ctx.body = ctx
  }
}

module.exports = new Conf()
