const crawler = require('../libs/crawler'),
     { CRAWL_URL } = require('../config')

module.exports = crawler({
  url: CRAWL_URL.index,
  async callback () {
    const { $ }         = window,
          puppeteer_pg_ = 'puppeteer_pg_',
          trimTxt       = window[`${ puppeteer_pg_ }trimTxt`],
          transferNum   = window[`${ puppeteer_pg_ }transferNum`]

    async function getAndFormatData(val) {
      const $el = $(val),
            $img = $el.find('img'),
            $info = $el.find('.info')
            $title = $info.find('.title'),
            $up_name = $info.find('.up'),
            $play_count = $info.find('.play')

      return {
        title: $title.text(),
        href: $el.prop('href'),
        img: $img.prop('src'),
        play_count: await transferNum(await trimTxt($play_count.text())),
        up_name: await trimTxt($up_name.text()),
        tags: '日常记录',
      }
    }

    const $items = Array.from($('.first-screen .video-card-reco .info-box a')),
          result = [];

    for await (const val of $items.map(item => getAndFormatData(item))) {
      result.push(val)
    }

    return result;
  }
})
