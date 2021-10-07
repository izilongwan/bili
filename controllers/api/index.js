const { COMMON, ENTRY } = require('../../libs/codeInfo');
const utils = require('../../libs/utils');
const User = require('./user')

class Api {
  async entry(ctx) {
    const { body } = ctx.request,
          { module: m,
            method } = body

    const ctxQueryBody = {
      module: m,
      method,
      retBody: {},
    }

    let ret = utils.checkParams(body, 'module', 'method')

    const { getReturnBodyInfo } = Api.prototype

    if (!ret) {
      ctx.body = getReturnBodyInfo(ctx, ctxQueryBody, COMMON.INVALID_PARAMS)
      return
    }

    const filename = (body.params || {}).filename

    ret = await utils.checkFileInfo(m, filename)

    if (!ret.exist) {
      ctx.body = getReturnBodyInfo(ctx, ctxQueryBody, ENTRY.MODULE_NOT_EXIST)
      return
    }

    let _module = ret.module

    if (!_module[method]) {
      if (_module.default && _module.default[method]) {
        _module = _module.default
      }
      else {
        ctx.body = getReturnBodyInfo(ctx, ctxQueryBody, ENTRY.METHOD_NOT_EXIST)
        return
      }
    }

    const retBody = await _module[method](ctx)

    ctx.body = getReturnBodyInfo(ctx, ctxQueryBody, ENTRY.SUCCESS, retBody)
  }

  getTimeStamp(ctx) {
    const { timeStart } = ctx.response;

    return Date.now() - timeStart
  }

  getReturnBodyInfo(ctx, ctxReqBody, info, retBody = {}) {
    const { getTimeStamp } = Api.prototype
    
    return {
      ...ctxReqBody,
      ...info,
      retBody,
      timeCost: getTimeStamp(ctx)
    }
  }
}

module.exports = new Api();
