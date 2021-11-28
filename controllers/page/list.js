const Service = require('../../service/index'),
      { CONF, NAV } = require('../../config');

module.exports = async (ctx) => {
  const { list } = CONF,
        { field } = ctx.params

  if (!field) {
    await ctx.render('list', {
      CONF: list,
      data: {
        data: [],
        count: 0
      },
      NAV: [],
      field,
    });
    return;
  }

  const baseParams = {
    page: 1,
    num: 20,
    type: 0,
  }

  const params = {
    ...baseParams,
    field,
  }

  const { code, msg, data = {} } = await Service.getData(params)

  if (code !== 0) {
    console.log('index -> msg', msg)
    return;
  }

  await ctx.render('list', {
    CONF: list,
    data,
    NAV,
    field,
  });
}
