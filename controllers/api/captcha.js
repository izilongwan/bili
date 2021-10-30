const captcha    = require('svg-captcha'),
      { COMMON } = require('../../libs/codeInfo'),
      { redisSet, redisGet } = require('../../libs/redisClient')

class Captcha {
  async create(ctx, next) {
    const ret = captcha.create({
      color: true,
    })

    Captcha.store[ret.text.toLowerCase()] = 1;
    if (ctx.request.method === 'GET') {
      ctx.body = ret.data
      ctx.type = 'svg'
      return
    }

    return {
      data: ret.data,
      ...COMMON.SUCCESS
    };
  }

  compareCaptcha(text) {
    text = text.toLowerCase()
    if (Captcha.store[text]) {
      delete Captcha.store[text]
      return true
    }

    return false
  }

  allStore(ctx) {
    ctx.body = Captcha.store
  }

  static store = {
    6666:1
  }
}

module.exports = new Captcha()
