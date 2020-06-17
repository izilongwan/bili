const crawler = require('../libs/crawler');
const { CRAWL_URL } = require('../config');

crawler({
  url: CRAWL_URL.index,
  callback () {
    const { $ } = window,
          $item = $('.agency-big-banner-ul .agency-big-banner-li'),
          result = [];

    $item.each((idx, val) => {
      const $el = $(val),
            $link = $el.find('.js-banner-btnqq'),
            $img = $link.find('img');

      const data = {
        c_id: parseInt($link.attr('data-id')),
        title: $link.attr('title'),
        href: $link.prop('href'),
        img: $img.prop('src')
      }

      result.push(data);
    })

    return result;
  }
})
