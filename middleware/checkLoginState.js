const User = require('../controllers/api/user')

module.exports = async function checkLoginState(ctx, next)  {
  if (ctx.session.sessionId) {
    User.generatorSessionId(ctx)
    await next()
    return
  }

  if (ctx.access === 1) {
    await next()
  }
}
