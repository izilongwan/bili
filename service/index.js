const FullRank = require('../models/FullRank');
const OriginRank = require('../models/OriginRank');
const BangumiRank = require('../models/BangumiRank');
const CinemaRank = require('../models/CinemaRank');
const RookieRank = require('../models/RookieRank');
const Carousel = require('../models/Carousel');
const Promote = require('../models/Promote');
const ESports = require('../models/ESports');
const Live = require('../models/Live');
const { COMMON, INDEX } = require('../libs/codeInfo');
const utils = require('../libs/utils');
const { Op } = require('sequelize')
const { QUERY } = require('../config')

const apis = QUERY.filter(({ apiName }) => apiName !== 'getDataCarousel');

class Index {
  async getData ({ apiName, page = 1, num = 12 }) {
    if (!apiName) {
      return COMMON.EMPTY_API_ANME;
    }

    if (!page) {
      return COMMON.EMPTY_PAGE;
    }

    if (!num) {
      return COMMON.EMPTY_NUM;
    }

    if (typeof page !== 'number') {
      return COMMON.INVALID_PAGE;
    }

    if (typeof num !== 'number') {
      return COMMON.INVALID_NUM;
    }

    const { prototype } = Index;

    const limit = num;
    const offset = (page - 1) * limit;
    const query = {
      limit,
      offset,
      where: {
        status: 1,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'status']
      }
    }

    if (apiName === '*') {
      const funcs = QUERY.map(({ apiName }) =>
        prototype[apiName](query)
      );

      const [err, res] = await utils.asyncFunc(
        () => Promise.all(funcs)
      );

      if (err) {
        return { code: -1, msg: err.message };
      }

      const data = res.reduce((prev, cur, idx) => {
        const { field } = QUERY[idx];

        cur.forEach((item) =>
          item.setDataValue('field', field)
        )
        prev[field] = cur;
        return prev;
      }, {})

      return { ...INDEX.SUCCESS_GET, data };
    }

    if (!prototype[apiName]) {
      return COMMON.INVALID_API_ANME;
    }

    const [err, res] = await utils.asyncFunc(
      () => prototype[apiName](query)
    );

    if (err) {
      return { code: -1, msg: err.message };
    }

    const { count } = Index;
    const { field } = QUERY.find(item => item.apiName === apiName);

    res.forEach((item) => item.setDataValue('field', field));

    const data = {
      data: res,
      count
    }

    return { ...INDEX.SUCCESS_GET, data };
  }

  async getSearchData ({ kw, apiName}) {
    kw = decodeURIComponent(kw);

    if (!kw) {
      return COMMON.EMPTY_KW;
    }

    if (!apiName) {
      return COMMON.EMPTY_API_ANME;
    }

    const { prototype } = Index;

    const query = {
      where: {
        [Op.or]: {
          title: { [Op.substring]: kw },
        },
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }

    if (apiName === '*') {
      const arr = apis.reduce((prev, { apiName }) =>
        prev.concat(prototype[apiName](query))
        , [])

      const [err, result] = await utils.asyncFunc(
        () => Promise.all(arr)
      );

      if (err) {
        ctx.body = { code: -1, msg: err.message };
        return;
      }

      const data = result.reduce((prev, cur, idx) => {
        const { field } = apis[idx];
        cur.forEach(item =>
          item.setDataValue('field', field)
        )
        return prev.concat(cur);
      }, [])

      const count = data.length;
      const countArr = result.map(item => item.length);

      countArr.unshift(count);

      return { ...INDEX.SUCCESS_GET, data: { data, countArr, count } };
    }

    if (!prototype[apiName]) {
      ctx.body = COMMON.INVALID_API_ANME;
      return;
    }

    const [err, data] = await utils.asyncFunc(
      () => prototype[apiName](query)
    );

    if (err) {
      ctx.body = { code: -1, msg: err.message };
      return;
    }
    const { field} = QUERY.find(item => item.apiName === apiName);
    const count = data.length;

    data.forEach(item => item.field = field);

    ctx.body = { ...INDEX.SUCCESS_GET, data: { data, count } };
  }

  async getSide () {
    const query = {
      limit: 8,
      where: {
        status: 1,
      },
      order: [['score', 'DESC']],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'status']
      }
    };

    return Index.prototype.getDataFull(query);
  }

  async getDataFull (query) {
    !query.order && (query.order = [['updatedAt', 'DESC']]);
    Index.count = await FullRank.count();
    return FullRank.findAll(query)
  }

  async getDataOrigin (query) {
    query.order = [['updatedAt', 'DESC']];
    Index.count = await OriginRank.count();
    return OriginRank.findAll(query);
  }

  async getDataBangumi (query) {
    query.order = [['updatedAt', 'DESC']];
    Index.count = await BangumiRank.count();
    return BangumiRank.findAll(query);
  }

  async getDataCinema (query) {
    query.order = [['updatedAt', 'DESC']];
    Index.count = await CinemaRank.count();
    return CinemaRank.findAll(query);
  }

  async getDataRookie (query) {
    query.order = [['updatedAt', 'DESC']];
    Index.count = await RookieRank.count();
    return RookieRank.findAll(query);
  }

  async getDataCarousel (query) {
    Index.count = await Carousel.count();
    return Carousel.findAll(query);
  }

  async getDataPromote (query) {
    Index.count = await Promote.count();
    return Promote.findAll(query);
  }

  async getDataLive (query) {
    Index.count = await Live.count();
    return Live.findAll(query);
  }

  async getDataESports (query) {
    Index.count = await ESports.count();
    return ESports.findAll(query);
  }
}

module.exports = new Index();
