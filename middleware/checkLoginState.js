const User = require('../controllers/api/user')
const { ENTRY } = require('../libs/codeInfo'),
      { EXCLUDE_METHODS } = require('../config')

module.exports = async function checkLoginState(ctx, next)  {
  const { body } = ctx.request,
        { module: m,
          method } = body

  if (EXCLUDE_METHODS[m] && EXCLUDE_METHODS[m].includes(method)) {
    await next()
    return 
  }

  if (ctx.session.sessionId) {
    User.generatorSessionId(ctx)
    await next()
    return
  }

  ctx.body = ENTRY.NOU_LOGIN
}
