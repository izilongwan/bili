const { EXCLUDE_METHODS } = require('../config')
const { ENTRY } = require('../libs/codeInfo')

module.exports = async function checkAccess(ctx, next) {
  const { body } = ctx.request,
        { module: m,
          method } = body

  if (EXCLUDE_METHODS[m]) {

    if (EXCLUDE_METHODS[m].includes(method) || EXCLUDE_METHODS[m].includes('*')) {

      ctx.access = 1
      await next()
      return
    }
    
    ctx.body = ENTRY.NOU_LOGIN
    return
  }

  await next()
}
