const Service = require('../../service/index'),
      { CONF } = require('../../config');

module.exports = async (ctx, next) => {
  const baseParams = {
    page: 1,
    num: 20
  }

  const params = {
    ...baseParams,
    field: 'all',
  }

  const { code, msg, data = {} } = await Service.getData(ctx, next, params),
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
