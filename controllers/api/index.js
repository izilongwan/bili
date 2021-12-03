const { COMMON, ENTRY } = require('../../libs/codeInfo');
const utils = require('../../libs/utils');

class Api {
  async entry(ctx, next) {
    await this.doCheckParams(ctx, next)
  }

  async doCheckParams(ctx, next) {
    const { body } = ctx.request,
          {  params = {} } = body

    const _params = {}

    for (const key in params) {
      if (Object.hasOwnProperty.call(params, key)) {
        const value = params[key];

        _params[key] = await this.checkParams(ctx, next, value)
      }
    }

    const ret = this.getReturnBodyInfo(ctx, ENTRY.SUCCESS, _params)

    ctx.body = ret
  }

  async checkParams(ctx, next, value) {
    if (value == null) {
      return value
    }

    const tsStart = Date.now()
    const { module: m,
            method, } = value || {}

    let ret = utils.checkParams(value, 'module', 'method')

    const { getReturnParamsInfo } = this
    const retBody = {},
          ctxReqBody = {
            module: m,
            method
          }
    const [isAccess, info] = utils.checkAccess(value.access)
    const timeCost = Date.now() - tsStart

    if (!isAccess) {
      return getReturnParamsInfo(ctxReqBody, {}, info, timeCost)
    }
      

    if (!ret) {
      return getReturnParamsInfo(ctxReqBody, retBody, COMMON.INVALID_PARAMS, timeCost)
    }

    ret = await utils.checkFileInfo(m)

    if (!ret.exist) {
      return getReturnParamsInfo(ctxReqBody, retBody, ENTRY.MODULE_NOT_EXIST, timeCost)
    }

    let _module = ret.module

    if (!_module[method]) {
      if (_module.default && _module.default[method]) {
        _module = _module.default
      }
      else {
        return getReturnParamsInfo(ctxReqBody, retBody, ENTRY.METHOD_NOT_EXIST, timeCost)
      }
    }

    // 传参 ctx、next、params
    ret = await _module[method](ctx, next, value.params)

    return getReturnParamsInfo(
      ctxReqBody,
      ret,
      ENTRY.SUCCESS,
      Date.now() - tsStart
    )
  }

  getTimeStamp(ctx) {
    const { timeStart } = ctx.response;

    return Date.now() - timeStart
  }

  getReturnParamsInfo(ctxReqBody, retBody, info, timeCost) {
    return {
      ...ctxReqBody,
      retBody,
      timeCost,
      ...info,
    }
  }

  getReturnBodyInfo(ctx, info, retBody = {}) {
    const { getTimeStamp } = this

    return {
      ...info,
      retBody,
      timeCost: getTimeStamp(ctx)
    }
  }
}

module.exports = new Api();
