const Service = require('../../service/index'),
      { CONF, SEARCH_NAV } = require('../../config');

module.exports = async (ctx) => {
  const { q, field: f } = ctx.query,
        { query }       = CONF,
        field           = f || 'all';

  if (!q) {
    await ctx.render('query', {
      CONF: query,
      data: {
        data: [],
        total: 0,
        fieldTotalObject,
      },
      field,
      NAV: SEARCH_NAV,
      curIdx: -1,
      kw: q
    });
    return;
  }

  ctx.request.body.params = { kw: q, field };

  const { code, msg, data = {} } = await Service.searchData(ctx);

  if (code !== 0) {
    console.log('list -> msg', msg)
    return;
  }

  await ctx.render('query', {
    CONF: query,
    data,
    field,
    NAV: SEARCH_NAV,
    curIdx: 0,
    kw: q
  });
}
