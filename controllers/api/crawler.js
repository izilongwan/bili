const { COMMON }           = require('../../libs/codeInfo'),
      CrawlerSettings      = require('../../models/CrawlerSettings'),
      { CRAWLER_SETTINGS } = require('../../config/index'),
      utils                = require('../../libs/utils')

const { MODELS, CRAWLERS, asyncFunc, createOrUpdateModel } = utils

class Crawler {
  constructor() {
    this.init()
  }

  async init() {
    let ret = await CrawlerSettings.count()

    if (ret <= 0) {
      for (const crawlerItem of CRAWLER_SETTINGS) {
        ret = await CrawlerSettings.create(crawlerItem)
      }
    }
  }

  async crawlerSettings(ctx) {
    const data = await CrawlerSettings.findAll(),
          total = await CrawlerSettings.count()

    return {
      ...COMMON.SUCCESS,
      data: {
        data,
        total
      }
    }
  }

  async crawlerSettingsUpdate(ctx) {
    const { params = {} } = ctx.request.body

    let ret = utils.checkParams(params, 'field', 'switch_type', 'id', 'duration', 'title')

    if (!ret) {
      return COMMON.INVALID_PARAMS
    }

    const {
      title,
      field,
      switch_type,
      id,
      duration } = params

    const conf = {
      silent: true, // 不更新updated_at
      where: {
        field,
        id,
      }
    }

    ret = await CrawlerSettings.findOne(conf);

    if (!ret) {
      return COMMON.DATA_NOT_FOUND
    }

    const data = {
      title,
      switch_type,
      duration
    }

    return utils.updateModelAndReturnRet(CrawlerSettings, data, conf)
  }

  async crawlerData(ctx) {
    const { params = {} } = ctx.request.body

    let ret = utils.checkParams(params, 'field', 'id')

    if (!ret) {
      return COMMON.INVALID_PARAMS
    }

    const { field, id } = params
    const models = await MODELS

    if (field === 'all') {
      return await this.crawlerDataAll()
    }

    const { status, isExist, data } = await this.crawlerSwitchModel(field)

    if (status === 1) {
      return COMMON.CRAWLER_DATA_DOING
    }

    if (!isExist) {
      return COMMON.FIELD_NOT_EXIST
    }

    const model = models[field]

    console.log('🚀 ~ file: crawler.js ~ line 89 ~ data', data.slice(-2), data.length)

    if (data.length > 0) {
      if (!model) {
        return COMMON.MODELS_NOT_EXIST
      }

      if (field === 'live') {
        ret = await model.destroy({
          where: {},
          truncate: true
        })
      }

      ret = await utils.createOrUpdateModel(model, data)
    }

    const conf = {
      where: { field, id },
      attributes: {
        exclude: ['createdAt']
      },
    }

    await CrawlerSettings.update({ status: 0 }, conf)

    return {
      ...COMMON.SUCCESS,
      data: await CrawlerSettings.findOne(conf)
    }
  }

  async crawlerSwitchModel(field, force = 1) {
    const crawler = (await CRAWLERS)[field]

    const conf = {
      where: {
        field,
      }
    }

    const { status } = await this.crawlerDataCheckStatus(field, force)

    if (status === 1) {
      return { status }
    }

    let data = []

    if (crawler) {
      try {
        await CrawlerSettings.update({ status: 1 }, conf)
        data = await crawler()
      } 
      catch (error) {
        console.log('🚀 ~ file: crawler.js ~ line 159 ~ Crawler ~ crawlerSwitchModel ~ error', error)
      }
      finally {
        await CrawlerSettings.update({ status: 0 }, conf)
      }

      return {
        status: 0,
        isExist: true,
        data
      }
    }

    return {
      status: 0,
      isExist: false,
    }
  }

  async crawlerDataAll() {
    const conf = {
      where: { },
    }

    const modelArrs = []
    const crawlerArrs = []

    const { models, crawlers } = await this.getAvariableModelsAndCrawlers()

    const modelsMap = Object.entries(models)

    for (const [field, model] of modelsMap) {
      conf.where.field = field
      modelArrs.push(CrawlerSettings.update({ status: 1 }, conf))
    }

    const [err0, data0] = await asyncFunc(
      () => Promise.all(modelArrs)
    );

    for (const [field, crawler] of Object.entries(crawlers)) {
      crawlerArrs.push(crawler())
    }

    const [err, allData] = await asyncFunc(
      () => Promise.all(crawlerArrs)
    );

    if (err) {
      return COMMON.CRAWLER_DATA_ERROR
    }

    const fieldKeys = Object.keys(crawlers)

    const allDataObj = allData.reduce((prev, curr, idx) => (prev[fieldKeys[idx]] = curr, prev),{})
    console.log('🚀 ~ file: crawler.js ~ line 204 ~ Crawler ~ crawlerDataAll ~ allDataObj', allDataObj)

    modelArrs.length = 0

    for (const [field, model] of modelsMap) {
      conf.where.field = field
      await createOrUpdateModel(model, allDataObj[field], conf)
    }

    modelArrs.length = 0

    for (const [field, model] of modelsMap) {
      conf.where.field = field
      modelArrs.push(CrawlerSettings.update({ status: 0 }, conf))
    }

    const [err1, data1] = await asyncFunc(
      () => Promise.all(modelArrs)
    );

    if (err1) {
      return COMMON.UPDATE_ERROR
    }

    console.log(data1.length)

    return COMMON.SUCCESS
  }

  async crawlerDataCheckStatus(field, force = 1) {
    if (force === 1) {
      return { status: 0 }
    }

    const conf = {
      where: {
        field
      }
    }

    const ret = await CrawlerSettings.findOne(conf);

    return {
      status: ret.status
    }
  }

  async getAvariableModelsAndCrawlers () {
    const models = await MODELS
    const crawlers = await CRAWLERS
    const settingsConf = {
      where: {
        switch_type: 1
      },
      attributes: {
        include: ['field']
      },
    }
    const ret = await CrawlerSettings.findAll(settingsConf)

    const fieldObj = ret.reduce((prev, curr) => (prev[curr.field] = 1, prev), {})

    delete fieldObj.all

    const newModels = {}
    const newCrawlers = {}

    for (const field in fieldObj) {
      if (Object.hasOwnProperty.call(fieldObj, field)) {
        models[field] && (newModels[field] = models[field])
        crawlers[field] && (newCrawlers[field] = crawlers[field])
      }
    }

    return { models: newModels, crawlers: newCrawlers }
  }
}

module.exports = new Crawler()
