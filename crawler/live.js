const crawler = require('../libs/crawler'),
     { CRAWL_URL } = require('../config')

module.exports = crawler({
  url: CRAWL_URL.index,
  async callback () {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(async () => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= 700) {

          clearInterval(timer);
          resolve();
        }
      }, 120);
    })

    const { $ }  = window,
          $items = Array.from($('#bili_live .live-list .live-card')),
          puppeteer_pg_ = 'puppeteer_pg_',
          transferNum   = window[`${ puppeteer_pg_ }transferNum`]
          result = [];

    async function getAndFormatData(val) {
      const $el = $(val),
            $link = $el.find('a'),
            $img = $link.find('img'),
            $live_count = $link.find('.count'),
            $up = $link.find('.up'),
            $title = $up.find('.desc')

      return {
        title: $title.prop('title'),
        href: $link.prop('href'),
        img: $img.prop('src'),
        live_count: await transferNum($live_count.text()),
        up_name: $up.find('.name').text(),
        up_img: $up.find('img').prop('src'),
        tags: $up.find('.tag').text(),
      }
    }

    for (const item of $items) {
      result.push(await getAndFormatData(item))
    }

    return result;
  }
})
