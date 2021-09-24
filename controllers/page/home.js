const Service = require('../../service/index'),
      { CONF } = require('../../config');

module.exports = async (ctx) => {
  const baseParams = {
    page: 1,
    num: 20
  }

  const params = {
    ...baseParams,
    field: 'all',
  }

  ctx.request.body.params = params

  const { code, msg, data = {} } = await Service.getData(ctx),
        { index }                = CONF

  console.log(code, msg, data.total)

  if (code !== 0) {
    console.log('index -> msg', msg)
    return;
  }

  await ctx.render('index', {
    data,
    CONF: index
  });
}
