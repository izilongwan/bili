const crawler = require('../libs/crawler');
const { CRAWL_URL } = require('../config');

crawler({
  url: CRAWL_URL.course,
  callback () {
    const { $ } = window,
          $item = $('.course-card-list .js-course-card-item'),
          result = [];

    $item.each((idx, el) => {
      const $el = $(el),
            $link = $el.find('.item-img-link'),
            $img = $link.find('.item-img'),
            $price = $el.find('.item-price'),
            $count = $el.find('.item-user');

      const price = $price.text();

      const data = {
        c_id: parseInt($link.attr('data-id')),
        href: $link.prop('href'),
        img: $img.prop('src'),
        title: $img.attr('title'),
        price: parseInt(price.substr(1)) ? parseInt(price.substr(1)) : 0,
        count: parseInt($count.text())
      }

      result.push(data);
    })

    return result;
  }
})
