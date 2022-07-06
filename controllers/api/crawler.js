const { COMMON }           = require('../../libs/codeInfo'),
      CrawlerSettings      = require('../../models/CrawlerSettings'),
      { CRAWLER_SETTINGS } = require('../../config/index'),
      utils                = require('../../libs/utils'),
      schedule             = require('node-schedule'),
      app                  = require('../../index'),
      { addErrorArgs }     = require('../../libs/utils'),
      crawler = require('../../libs/crawler')

const {
  MODELS,
  asyncFunc,
  createOrUpdateModel,
  removeModelHrefs,
} = utils;

class Crawler {
  constructor(app) {
    this.init()
  }

  async init() {
    await this.generatorBaseSettings()
    await this.schduleAutoCrawleData()
  }

  async generatorBaseSettings() {
    let ret = await CrawlerSettings.count()

    if (ret > 0) {
      return
    }

    for (const crawlerItem of CRAWLER_SETTINGS) {
      ret = await CrawlerSettings.create(crawlerItem)
    }
  }

  async crawlerSettings() {
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

  async crawlerSettingsUpdate(ctx, next, params = {}) {
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

  async crawlerData(ctx, next, params = {}) {
    let ret = utils.checkParams(params, 'field', 'id')

    if (!ret) {
      return COMMON.INVALID_PARAMS
    }

    const { field, id } = params
    const models = await MODELS

    if (field === 'all') {
      return await this.crawlerDataAll(ctx)
    }

    const { status, isExist, data } = await this.crawlerSwitchModel(field)

    if (status === 1) {
      return COMMON.CRAWLER_DATA_DOING
    }

    if (!isExist) {
      return COMMON.FIELD_NOT_EXIST
    }

    const model = models[field]

    // console.log('🚀 ~ file: crawler.js ~ line 89 ~ data', data.slice(-2), data.length)

    let finalRet = null

    try {
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
        raw: true,
      }

      await CrawlerSettings.update({ status: 0 }, conf)
      const ret0 = await CrawlerSettings.findOne(conf)

      finalRet = {
        ...COMMON.SUCCESS,
        data: Object.assign({ crawleDataLength: data.length }, ret0)
      }
    }
    catch (error) {
      app.emit('error', addErrorArgs(error))
      finalRet = Object.assign(COMMON.CRAWLER_DATA_ERROR, { msg: error.message })
    }
    finally {
      return finalRet
    }
  }

  async crawlerSwitchModel(field, force = 1) {
    // const crawler = (await CRAWLERS)[field]

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

    // if (crawler) {
      try {
        await CrawlerSettings.update({ status: 1 }, conf)
        data = await crawler({ field })()
      }
      catch (error) {
        app.emit('error', addErrorArgs(error))
      }
      finally {
        await CrawlerSettings.update({ status: 0 }, conf)
      }

      return {
        status: 0,
        isExist: true,
        data
      }
    // }

    // return {
    //   status: 0,
    //   isExist: false,
    // }
  }

  async crawlerDataAll(ctx) {
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

    let crawleDataLength = 0
    let finalRet = null

    try {
      const allData = []
      const timeObj = {}

      for (const [field, crawler] of Object.entries(crawlers)) {
        crawlerArrs.push(crawler())
        console.log(`[START]====${ field }`)

        const start = Date.now()
        const [err10, data10] = await asyncFunc(crawler)

        timeObj[field] = Date.now() - start

        console.log(`[END]====${ field }  ${ timeObj[field] }ms`)

        if (err10) {
          app.emit('error', addErrorArgs(err10), ctx)
          finalRet = COMMON.CRAWLER_DATA_ERROR
          return
        }

        allData.push(data10)
      }

      const fieldKeys = Object.keys(crawlers)

      const allDataObj = allData.reduce((prev, curr, idx) => (prev[fieldKeys[idx]] = curr, prev),{})
      // console.log('🚀 ~ file: crawler.js ~ line 230 ~ allDataObj', allDataObj)

      modelArrs.length = 0

      for (const [field, model] of modelsMap) {
        const { where, ...restConf } = conf

        conf.where.field = field

        await removeModelHrefs(model)
        await createOrUpdateModel(model, allDataObj[field], restConf)
        await new Promise((resolve) => {
          setTimeout(async () => {
            await CrawlerSettings.update({ status: 0 }, conf)

            resolve()
          }, timeObj[field])
        })

        crawleDataLength += allDataObj[field].length
      }

      conf.where.field = 'all'
      await CrawlerSettings.update({ status: 0 }, conf)

      const settingsConf = {
        where: {
          switch_type: 1
        },
        attributes: {
          exclude: ['createdAt', 'title', 'id', 'duration', 'status'],
          // include: ['updatedAt', 'field'],
        },
        raw: true,
      }
      const rs = await CrawlerSettings.findAll(settingsConf)

      finalRet = Object.assign({ data: { crawleDataLength, data: rs } }, COMMON.SUCCESS)
    }

    catch (error) {
      app.emit('error', addErrorArgs(error), ctx)
      finalRet.msg = error.msg
    }

    finally {
      return finalRet
    }
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
    // const crawlers = await CRAWLERS
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
        newCrawlers[field] = crawler({ field })
      }
    }

    return { models: newModels, crawlers: newCrawlers }
  }

  async schduleAutoCrawleData() {
    const timeOptions = await this.getAutoCrawleScheduleTime()

    if (!timeOptions) {
      return
    }

    this.jobTimeOptions = timeOptions
    this.job = schedule.scheduleJob(timeOptions, async () => {
      await this.jobTask(async () => {
        await this.crawlerDataAll()
      })
    })
  }

  async jobTask(callback) {
    const timeOptions = await this.getAutoCrawleScheduleTime()
    // console.log('🚀 ~ line 340 ~ timeOptions', timeOptions)

    if (!timeOptions) {
      return
    }

    if (JSON.stringify(timeOptions) === JSON.stringify(this.jobTimeOptions)) {
      await callback()
      return
    }

    this.jobTimeOptions = timeOptions
    this.job && this.job.cancel(true)
    this.job = schedule.scheduleJob(timeOptions, async () => {
      await this.jobTask(callback)
    })
  }

  async getAutoCrawleScheduleTime() {
    const [field, id] = ['all', 1]
    const ret = await CrawlerSettings.findOne({
      where: {
        field,
        id,
      },
      // attributes: {
      //   include: ['duration', 'switch_type', 'status']
      // },
      raw: true,
    })

    // console.log(ret)

    if (!ret) {
      return
    }

    const { duration, switch_type, status } = ret

    if (switch_type === 0) {
      this.job && this.job.cancel(true)
      return
    }

    let { hour } = utils.getTime(duration)

    hour = Array.from({ length: ~~(24 / hour) }, (_, idx) => idx * hour)
    // console.log('🚀 ~ file: crawler.js ~ line 331 ~ hour', hour)

    return { hour, minute: 0, second: 0 }
  }
}

module.exports = new Crawler(app)
