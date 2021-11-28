const UserModel                   = require('../../models/User'),
      { makeCrypto, checkParams } = require('../../libs/utils'),
      { COMMON }                  = require('../../libs/codeInfo'),
      Captcha                     = require('./captcha'),
      utils                       = require('../../libs/utils')

class User {
  async login(params = {}, ctx) {
    const { account,
            password,
            captcha } = params

    let ret = utils.checkParams(params, 'password', 'account', 'captcha')

    if (!ret) {
      return COMMON.INVALID_PARAMS
    }

    if (!Captcha.compareCaptcha(captcha)) {
      return COMMON.INVALID_CAPTCHA
    }

    ret = await this.checkUserExists(account)

    if (!ret) {
      return COMMON.NOT_EXIST
    }

    if (account !== ret.account) {
      return COMMON.INVALID_ACCOUNT_OR_PASSWORD
    }

    if (makeCrypto(password) !== ret.password) {
      return COMMON.INVALID_ACCOUNT_OR_PASSWORD
    }

    if (!ctx.session.sessionId) {
      this.generatorSessionId(ctx)
    }

    return COMMON.SUCCESS
  }

  generatorSessionId(ctx) {
    const id = makeCrypto(new Date().toString() + Math.random())

    ctx.session.sessionId = id
  }

  async add(params = {}) {
    const { account,
            password,
            captcha } = params

    let ret = checkParams(params, 'account', 'password', 'captcha')

    if (!ret) {
      return COMMON.INVALID_PARAMS
    }

    if (!Captcha.compareCaptcha(captcha)) {
      return COMMON.INVALID_CAPTCHA
    }

    ret = await this.checkUserExists(account)

    if (ret) {
      return COMMON.ACCOUNT_EXISTS
    }

    ret = await UserModel.create({ account, password: makeCrypto(password) })

    if (!ret) {
      return COMMON.ADD_ACCOUNT_FAILED
    }

    return COMMON.SUCCESS
  }

  async logout(ctx) {
    delete ctx.session.cookie
    delete ctx.session.sessionId

    return COMMON.SUCCESS
  }

  async checkLoginState(ctx) {
    return ctx.session.sessionId ? COMMON.SUCCESS : ENTRY.NOT_LOGIN
  }

  async checkUserExists(account) {
    return UserModel.findOne({ where: { account, status: 1 } })
  }
}

module.exports = new User()
