const captcha        = require('svg-captcha'),
      { COMMON }     = require('../../libs/codeInfo'),
      { CacheStore } = require('../../libs/utils/CacheStore')

class Captcha {
  async create(ctx, next, params = {}) {
    const ret = captcha.create({
      color: true,
    })

    const key = ret.text.toLowerCase()
    const { ts = 1000 * 60 * 3 } = params

    this.store.setItem(key, 1, ts)

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
    
    const ret = this.store.getItem(text)
    ret && this.store.removeItem(text)
    return ret
  }

  allStore(ctx) {
    ctx.body = this.store
  }

  store = new CacheStore()
}

module.exports = new Captcha()
