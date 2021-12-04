const { addErrorArgs } = require('../libs/utils')

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    const status = error.status || 500

    ctx.status = status
    ctx.body = error
    ctx.app.emit('error', addErrorArgs(error), ctx)
  }
}