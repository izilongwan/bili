const { COMMON } = require('../../libs/codeInfo');
const utils = require('../../libs/utils');
const { Op } = require('sequelize');
const { NAV } = require('../../config');
const { object: { deepClone } } = require('@izilong/util')

const { MODELS } = utils

class Data {
  constructor(conf = { where: {} }) {
    this.conf = conf
  }

  get getConf() {
    return deepClone(this.conf)
  }

  getDataFieldOrder(aOrder, field) {
    const play_count = ['play_count', 'DESC']
    const fav_count = ['fav_count', 'DESC']
    const popup_count = ['popup_count', 'DESC']
    const score = ['score', 'DESC']
    const thumb_count = ['thumb_count', 'DESC']
    const live_count = ['live_count', 'DESC']
    const updated = ['updatedAt', 'DESC']

    const oOrders = {
      promote: {
        updated,
      },
      carousel: {
        updated,
      },
      bangumi: {
        play_count,
        fav_count,
        popup_count,
      },
      movie: {
        play_count,
        fav_count,
        popup_count,
      },
      full: {
        score,
      },
      origin: {
        score,
      },
      record: {
        play_count,
      },
      rookie: {
        score,
        play_count,
        popup_count,
      },
      e_sports: {
        thumb_count,
        play_count,
      },
      live: {
        live_count,
      }
    }

    if (aOrder === 'hot') {
      if (oOrders[field]) {
        return Object.values(oOrders[field])
      }

      return []
    }

    if (!Array.isArray(aOrder)) {
      return []
    }

    return aOrder.reduce((p, c) => {
      const order = oOrders[field] && oOrders[field][c]

      order && p.push(order)

      return p
    }, [])
  }

  async getData (ctx, next, params = {}) {
    const { field,
            page,
            num,
            order = [],
            type = 0 } = params

    let ret = utils.checkParams(params, 'field', 'page', 'num')

    if (!ret) {
      return COMMON.INVALID_PARAMS
    }

    const conf = this.getConf
    const limit = +num;
    const offset = (+page - 1) * +limit;
    const query = {
      limit,
      offset,
      attributes: {
        exclude: ['createdAt']
      },
      order: [['updatedAt', 'DESC']],
      ...conf,
    }

    this.setDataOrderType({ query, field, order })

    if (field === 'all') {
      return await this.getAllData(query, type)
    }

    const model = (await MODELS)[field]

    if (!model) {
      return COMMON.FIELD_NOT_EXIST;
    }

    const data = await model.findAll(query)

    if (!data) {
      return { ...COMMON.OPERATE_DATABASE_ERROR, msg: err.message };
    }

    const total = await model.count(conf);

    data.forEach((item) => item.setDataValue('field', field));

    ret = params.type === 0
      ? await this.getDataSingleByField(data, total, conf)
      : { data, total }

    return { ...COMMON.SUCCESS, data: ret };
  }

  async searchData (ctx, next, params = {}) {
    const { field, kw }   = params

    let ret = utils.checkParams(params, 'field', 'kw')

    if (!ret) {
      return COMMON.INVALID_PARAMS
    }

    const conf = this.getConf

    const query = {
      ...conf,
      order: [['updatedAt', 'DESC']],
      attributes: {
        exclude: ['createdAt']
      }
    }
    query.where.title = { [Op.substring]: kw }

    const models = await MODELS

    if (field === 'all') {
      return await this.getAllData(query, 1)
    }

    const model = models[field]

    if (!model) {
      return COMMON.FIELD_NOT_EXIST;
    }

    let data = await model.findAll(query)

    if (!data) {
      return COMMON.DATA_QUERY_ERROR
    }

    const total = model.count(conf);

    data.forEach((item) => item.setDataValue('field', field));

    data = { data, total, fieldsTotalObject: { [field]: total, all: total } };

    return { ...COMMON.SUCCESS, data };
  }

  async updateData(ctx, next, params = {}) {
    let ret = utils.checkParams(params, 'status', 'id', 'field')

    if (!ret) {
      return COMMON.INVALID_PARAMS
    }

    const { field, status, id, title, author_name, tags } = params,
          data = { status, id, title, author_name, tags }

    const model = (await MODELS)[field]

    if (!model) {
      return COMMON.FIELD_NOT_EXIST
    }

    const conf = this.getConf

    conf.where.id = id
    conf.silent = true
    author_name && (conf.where.author_name = author_name)

    return utils.updateModelAndReturnRet(model, data, conf)
  }

  async getAllData (conf, type) {
    const models = await MODELS
    const arr = []
    const query = deepClone(conf)

    for (const [field, model] of Object.entries(models)) {
      const fieldConf = this.setDataOrderType({ field, order: 'hot', query })
      arr.push(model.findAll(fieldConf))
    }

    const [err, result] = await utils.asyncFunc(
      () => Promise.all(arr)
    );

    if (err) {
      return COMMON.DATA_QUERY_ERROR
    }

    const modelKeys = Object.keys(models)

    const data = this.getDataSwitchType(result, modelKeys, type)

    return { ...COMMON.SUCCESS, data };
  }

  getDataSwitchType(result, modelKeys, type = 0) {
    switch (type) {
      case 0:
        return this.getDataByField(result, modelKeys)

      case 1:
        return this.getDataByArray(result, modelKeys)

      default:
        return this.getDataByField(result, modelKeys)
    }
  }

  setDataOrderType ({ field, order, query }) {
    const aOrder = this.getDataFieldOrder(order, field)

    aOrder.length && (query.order = aOrder)

    return query
  }

  getDataByArray(result, modelKeys) {
    const fieldsTotalObject = {}
    const data = result.reduce((prev, cur, idx) => {
      const field = modelKeys[idx]

      const ret = cur.reduce((innerPrev, innerCurr) => {
        innerCurr.setDataValue('field', field)

        return innerPrev.concat(innerCurr)
      }, [])

      fieldsTotalObject[field] = cur.length

      return prev.concat(ret);
    }, [])

    fieldsTotalObject.all = data.length

    return { data, total: data.length, fieldsTotalObject }
  }

  getDataByField(result, modelKeys) {
    return result.reduce((prev, cur, idx) => {
      const field = modelKeys[idx],
            len = cur.length

      prev.total += len

      prev.data[field] = {
        total: len,
        data: []
      }

      cur.reduce((innerPrev, innerCurr) => {
        innerCurr.setDataValue('field', field)
        innerPrev.data.push(innerCurr)

        return innerPrev
      }, prev.data[field])

      return prev
    }, { data: {}, total: 0 })
  }

  async getDataSingleByField(data, total, conf) {
    const ret = { data,
                  total },
          fieldsTotalObject = {}

    const models = await MODELS

    total = 0

    for (const key in models) {
      if (Object.hasOwnProperty.call(models, key)) {
        const count = await models[key].count(conf)
        fieldsTotalObject[key] = count
        total += count
      }
    }

    fieldsTotalObject.all = total
    ret.fieldsTotalObject = fieldsTotalObject
    return ret
  }

  getNav() {
    return { ...COMMON.SUCCESS, data: NAV };
  }
}

module.exports = {
  default: new Data(),
  Data,
}
