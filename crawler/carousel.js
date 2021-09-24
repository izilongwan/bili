const crawler = require('../libs/crawler');
const { CRAWL_URL } = require('../config');

module.exports = crawler({
  url: CRAWL_URL.index,
  callback () {
    const { $ } = window,
          $items = $('#reportFirst1 .item'),
          result = [];

    $items.each((idx, val) => {
      const $el   = $(val),
            $link = $el.find('a'),
            $img  = $link.find('img');

      const data = {
        title: $img.attr('title') || $img.attr('alt'),
        href: $link.prop('href'),
        img: $img.prop('src')
      }

      result.push(data);
    })

    return result;
  }
})
