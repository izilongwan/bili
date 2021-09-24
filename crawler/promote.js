const crawler = require('../libs/crawler');
const { CRAWL_URL } = require('../config');

module.exports = crawler({
  url: CRAWL_URL.index,
  async callback () {
    const { $ }         = window,
          $items        = Array.from($('#reportFirst2 .ex-card-common')),
          puppeteer_pg_ = 'puppeteer_pg_',
          trimTxt       = window[`${ puppeteer_pg_ }trimTxt`],
          result        = [];

    async function getAndFormatData(val) {
      const $el = $(val),
            $link = $el.find('a'),
            $img = $link.find('img'),
            $title = $link.find('.ex-title')
            $up = $el.find('.ex-up')

      const up_href = $up.prop('href')

      return up_href
        ? {
          title: $title.attr('title'),
          href: $link.prop('href'),
          img: $img.prop('src'),
          up_name: await trimTxt($up.text()),
          up_href,
        }
        : null
    }

    let ret = null

    for (const item of $items) {
      ret = await getAndFormatData(item)
      ret && result.push(ret)
    }

    return result;
  }
})
