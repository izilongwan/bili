const crawler = require('../libs/crawler'),
     { CRAWL_URL } = require('../config')

module.exports = crawler({
  url: CRAWL_URL.index,
  async callback () {
    async function autoScroll (maxY) {
      await new Promise((resolve, reject) => {
        let totalHeight = 0,
            distance    = 100,
            isReach     = false

        const timer = setInterval(async () => {
          try {
            if (!isReach) {
              window.scrollBy(0, distance);
              totalHeight += distance;
            }

            if (totalHeight >= maxY) {
              isReach = true
              const $lastItem  = $('#reportFirst3 .video-card-common').last(),
                    lastImgSrc = $lastItem.find('.card-pic img').prop('src'),
                    reg        = /https?:/

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

        setTimeout(() => resolve(), 1000 * 10)
      })
    }

    await autoScroll(700)

    const { $ }         = window,
          $items        = Array.from($('#reportFirst3 .video-card-common')),
          result        = [],
          puppeteer_pg_ = 'puppeteer_pg_',
          trimTxt       = window[`${ puppeteer_pg_ }trimTxt`],
          transferNum   = window[`${ puppeteer_pg_ }transferNum`]

    async function getAndFormatData(val) {
      const $el = $(val),
            $link = $el.find('.card-pic a'),
            $img = $link.find('img'),
            $duration = $link.find('.count .right span'),
            $leftSpan = $link.find('.count .left span'),
            $thumb_count = $leftSpan.eq(0),
            $play_count = $leftSpan.eq(1),
            $title = $el.children('.title')

      return {
        title: $title.prop('title'),
        href: $link.prop('href'),
        img: $img.prop('src'),
        duration: $duration.text(),
        thumb_count: await transferNum(await trimTxt($thumb_count.text())),
        play_count: await transferNum(await trimTxt($play_count.text())),
      }
    }

    for await (const ret of $items.map(item => getAndFormatData(item))) {
      result.push(ret)
    }



    // $item.each((idx, val) => {
    //   const $el = $(val),
    //         $link = $el.find('.match-card-pic a'),
    //         $img = $link.find('img'),
    //         $live_count = $link.find('.count .right'),
    //         $left = $link.find('.count .left span'),
    //         $thumb_count = $left.children(1),
    //         $play_count = $left.children(2),
    //         $left = $link.find('.count .left'),
    //         $title = $el.find('.live-title')

    //   const data = {
    //     title: $title.prop('title'),
    //     href: $link.prop('href'),
    //     img: $img.prop('src'),
    //     live_count: $live_count.text(),
    //     thumb_count: $thumb_count.text(),
    //     play_count: $play_count.text(),
    //     up_name: $up.find('.name').text(),
    //     up_img: $up.find('img').prop('src'),
    //     tag: $up.find('.tag').text(),
    //   }

    //   result.push(data);
    // })

    return result;
  }
})
