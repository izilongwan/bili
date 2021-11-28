const User = require('../controllers/api/user')
const { ENTRY } = require('../libs/codeInfo')

module.exports = async function checkLoginState(ctx, next)  {
  if (ctx.session.sessionId) {
    User.generatorSessionId(ctx)
    await next()
    return
  }

  ctx.body = ENTRY.NOT_LOGIN
}
