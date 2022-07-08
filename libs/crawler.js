const pt = require('puppeteer'),
      { trimTxt,
        transferNum,
        addErrorArgs
      } = require('../libs/utils'),
      app = require('..')

const { LAUNCH_CONFIG, CRAWL_INTERVAL } = require('../config')
const CrawlerSettings = require('../models/CrawlerSettings')

async function autoScroll(getLastCallback, maxY) {
  await new Promise((resolve, reject) => {
    let totalHeight = 0,
        distance    = 100

    const timer = setInterval(async () => {
      try {
        window.scrollBy(0, distance);
        totalHeight += distance;
        const y = max === Infinity
          ? document.body.scrollHeight - window.innerHeight
          : maxY

        if (totalHeight >= y) {
          const reg = /https?:/

          // 防止图片取的是懒加载的图片
          if (reg.test(getLastCallback())) {
            clearInterval(timer);
            resolve();
          }
        }
      } catch (error) {
        // console.log('🚀 ~ file: crawler.js ~ line 28 ~ timer ~ error', error)
      }
    }, 120);
  })
}

const crawler = options => async () => {

  return new Promise(async (resolve, reject) => {
    let bs = null

    try {
      bs = await pt.launch(LAUNCH_CONFIG)

      const pg = await bs.newPage(),
            { field } = options,
            puppeteer_pg_ = 'puppeteer_pg_'

      const conf = {
        where: {
          field,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'title', 'id', 'status'],
        },
        raw: true,
      }

      const { evalStr, url } = await CrawlerSettings.findOne(conf)

      await pg.goto(url, {
        timeout: 30 * 1000,
        waitUtil: 'networkidel2'
      })

      await pg
        .mainFrame()
        .addScriptTag({ url: 'https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js' })

      await pg.exposeFunction(`${ puppeteer_pg_ }trimTxt`, trimTxt)
      await pg.exposeFunction(`${ puppeteer_pg_ }transferNum`, transferNum)
      await pg.exposeFunction(`${ puppeteer_pg_ }autoScroll`, autoScroll)

      const result = await pg.evaluate(({ evalStr }) => {
        return eval(evalStr)
      }, { evalStr })

      setTimeout(() => resolve(result), CRAWL_INTERVAL)

    } catch (error) {
      reject(error)
    }

    bs && await bs.close()
  })
}

// const autoScroll = window['puppeteer_pg_autoScroll']
// const $items = $('.bili-video-card__wrap')

// const getLastCallback = function() {
//   const $lastItem = $('.bili-video-card__cover .bili-video-card__cover').last()
//   const lastImgSrc = $lastItem.find('img').prop('src')
//   return lastImgSrc
// }

// autoScroll(getLastCallback, 0)

// const result = []

// $items.each((idx, val) => {
//   const $val = $(val)
//   const $mid = $val.find('.bili-video-card__mask')
//   const $bottom = $val.find('.bili-video-card__info--right')
//   const $img = $val.find('.bili-video-card__cover img')

//   const data = {
//     img: $img.prop('src'),
//     title: $bottom.find('.bili-video-card__info--tit').attr('title'),
//     href: $bottom.find('.hoverZoomMouseover').prop('href'),
//     up_name: $bottom.find('.bili-video-card__info--author').text(),
//     play_count: $mid.find('.bili-video-card__stats--text').text(),
//     tags: '日常记录',
//   }

//   result.push(data)
// })

// result



module.exports = crawler;
