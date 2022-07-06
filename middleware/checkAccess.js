const { EXCLUDE_METHODS } = require('../config')
const User = require('../controllers/api/user')

module.exports = async function checkAccess(ctx, next) {
  const { body }   = ctx.request,
        { params = {} } = body

  const isLogin = ctx.session.sessionId ? true : false

  for (const key in params) {
    if (Object.hasOwnProperty.call(params, key)) {
      const { module: m,
        method } = params[key] || {};

        if (EXCLUDE_METHODS[m]) {

          if (EXCLUDE_METHODS[m].includes(method) || EXCLUDE_METHODS[m].includes('*')) {

            params[key]['access'] = 1 // 可以请求
            continue
          }

          params[key]['access'] = 0 // 无权限
        }
        else {
          params[key]['access'] = isLogin ? 1 : 1 // 需要登录
        }
    }
  }

  ctx.session.sessionId && User.generatorSessionId(ctx)

  await next()
}
