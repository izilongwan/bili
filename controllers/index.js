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
const { Op } = require('sequelize');
const { QUERY } = require('../config')

const apis = QUERY.filter(({ apiName }) => apiName !== 'getDataCarousel');

class Index {
  async getData (ctx, next) {
    const { apiName, page, num } = ctx.request.body;

    if (!apiName) {
      ctx.body = COMMON.EMPTY_API_ANME;
      return;
    }

    if (!page) {
      ctx.body = COMMON.EMPTY_PAGE;
      return;
    }

    if (!num) {
      ctx.body = COMMON.EMPTY_NUM;
      return;
    }

    if (typeof page !== 'number') {
      ctx.body = COMMON.INVALID_PAGE;
      return;
    }

    if (typeof num !== 'number') {
      ctx.body = COMMON.INVALID_NUM;
      return;
    }

    const { prototype } = Index;

    if (!prototype[apiName]) {
      ctx.body = COMMON.INVALID_API_ANME;
      return;
    }

    const limit = num;
    const offset = (page - 1) * limit;

    const query = {
      limit,
      offset,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }

    const [err, data] = await utils.asyncFunc(
      () => prototype[apiName](query)
    );

    if (err) {
      ctx.body = { code: -1, msg: err.message };
      return;
    }

    const { count } = Index;
    ctx.body = { ...INDEX.SUCCESS_GET, res: { data, count } };
  }

  async searchData (ctx, next) {
    const { apiName, kw } = ctx.request.body;

    if (!apiName) {
      ctx.body = COMMON.EMPTY_API_ANME;
      return;
    }

    if (!kw) {
      ctx.body = COMMON.EMPTY_KW;
      return ;
    }

    const { prototype } = Index;

    const query = {
      where: {
        title: { [Op.substring]: kw }
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
        return { code: -1, msg: err.message };
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

      ctx.body = { ...INDEX.SUCCESS_GET, data: { data, countArr, count } };
      return;
    }

    if (!prototype[apiName]) {
      ctx.body = COMMON.INVALID_API_ANME;
      return;
    }

    const [err, data] = await utils.asyncFunc(
      () => prototype[apiName](query)
    );

    if (err) {
      return { code: -1, msg: err.message };
    }

    const count = data.length;
    ctx.body = { ...INDEX.SUCCESS_GET, data: { data, count } };
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
