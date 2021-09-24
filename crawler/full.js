const crawler = require('../libs/crawler'),
     { CRAWL_URL } = require('../config')

module.exports = crawler({
  url: CRAWL_URL.full,
  async callback () {
    const { $ }         = window,
          maxY          = document.body.scrollHeight - window.innerHeight
          puppeteer_pg_ = 'puppeteer_pg_',
          trimTxt       = window[`${ puppeteer_pg_ }trimTxt`],
          transferNum   = window[`${ puppeteer_pg_ }transferNum`]

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
              if (reg.test(lastImgSrc)) {
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

    async function getAndFormatData(val) {
      const $el = $(val),
            $link = $el.find('a'),
            $img = $link.find('img'),
            $info = $el.find('.info')
            $title = $info.find('.title'),
            $detail = $info.find('.detail'),
            $dataBox = $detail.find('.data-box'),
            $play_count = $dataBox.eq(0),
            $popup_count = $dataBox.eq(1),
            $up = $detail.find('a'),
            $up_name = $up.find('.data-box'),
            $score = $info.find('.pts').children(':first')

      return {
        title: $title.text(),
        href: $link.prop('href'),
        img: $img.prop('src'),
        play_count: await transferNum(await trimTxt($play_count.text())),
        popup_count: await transferNum(await trimTxt($popup_count.text())),
        up_href: $up.prop('href'),
        up_name: await trimTxt($up_name.text()),
        score: await transferNum(await trimTxt($score.text())),
        tags: '全站',
      }
    }

    await autoScroll(maxY)

    const $items = Array.from($('.rank-list .rank-item .content')),
          result = [];

    for await (const val of $items.map(item => getAndFormatData(item))) {
      result.push(val)
    }

    return result;
  }
})
