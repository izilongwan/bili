const pt = require('puppeteer'),
    { trimTxt,
      transferNum,
      addErrorArgs } = require('../libs/utils'),
    app = require('..')

async function autoScroll(maxY) {
  await new Promise((resolve, reject) => {
    let totalHeight = 0,
        distance    = 100

    const timer = setInterval(async () => {
      try {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= maxY) {
          const $lastItem = $('.rank-list .rank-item .content').last(),
                lastImgSrc = $lastItem.find('a img').prop('src'),
                reg = /https?:/

          // 防止图片取的是懒加载的图片
          console.log('🚀 ~ file: full.js ~ line 29 ~ timer ~ lastImgSrc', lastImgSrc)
          if (reg.test(lastImgSrc)) {
            clearInterval(timer);
            resolve();
          }
        }
      } catch (error) {
        app.emit('error', addErrorArgs(error))
        // console.log('🚀 ~ file: crawler.js ~ line 28 ~ timer ~ error', error)
      }
    }, 120);
  })
}

const crawler = options => async () => {

  try {
    return new Promise(async (resolve, reject) => {
      const launchConfig = {
        timeout: 10 * 60 * 1000,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      }

      const bs = await pt.launch(launchConfig),
            pg = await bs.newPage(),
            { url, callback } = options,
            puppeteer_pg_ = 'puppeteer_pg_'

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

      const result = await pg.evaluate(callback)

      await bs.close();

      resolve(result)
      return result
    })
  } catch (error) {
    app.emit('error', addErrorArgs(error))
    return []
  }
}

module.exports = crawler;
