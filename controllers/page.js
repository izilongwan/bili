const Service = require('../service/index'),
      { CONF, FIELDS, NAV, SEARCH_NAV } = require('../config');

const index = async (ctx) => {
  const { code, msg, data } = await Service.getData({ apiName: '*' }),
        side = await Service.getSide(),
        { index } = CONF;

  if (code !== 0) {
    console.log('index -> msg', msg)
    return;
  }

  await ctx.render('index', {
    data: {...data, side },
    CONF: index
  });
}

const list = async (ctx) => {
  const { list } = CONF,
        { field } = ctx.params,
        apiName = FIELDS[field];

  if (!apiName) {
    await ctx.render('list', {
      CONF: list,
      res: {
        data: [],
        count: 0
      },
      curIdx: -1,
      NAV: [],
      field,
      apiName
    });
    return;
  }

  const { code, msg, data } = await Service.getData({ apiName, num: 48 })

  if (code !== 0) {
    console.log('index -> msg', msg)
    return;
  }

  const curIdx = NAV.findIndex(item => item.field === field);

  await ctx.render('list', {
    CONF: list,
    res: data,
    curIdx,
    NAV,
    field,
    apiName
  });
}

const query = async (ctx) => {
  const { q } = ctx.query,
        { field } = ctx.params,
        { query } = CONF,
        apiName = FIELDS[field] || '*';

  if (!q) {
    await ctx.render('query', {
      CONF: query,
      res: {
        data: [],
        count: 0
      },
      field,
      NAV,
      curIdx: -1,
      kw: q
    });
    return;
  }

  const conf = { kw: q, apiName };
  const { code, msg, data } = await Service.getSearchData(conf);

  if (code !== 0) {
    console.log('list -> msg', msg)
    return;
  }

  await ctx.render('query', {
    CONF: query,
    res: data,
    field,
    NAV: SEARCH_NAV,
    curIdx: 0,
    kw: q
  });
}

const notFound = async (ctx) => {
  const { notFound } = CONF;

  await ctx.render('notFound', {
    CONF: notFound,
  });
}

module.exports = {
  index,
  list,
  query,
  notFound
}
