const crawler = require('../libs/crawler');
const { CRAWL_URL } = require('../config');

crawler({
  url: CRAWL_URL.index,
  callback () {
    const { $ } = window,
          $item = $('.spread-course-ul li'),
          result = [];

    $item.each((idx, el) => {
      const $el = $(el),
            $link = $el.find('.spread-course-cover-wrap a'),
            $img = $link.find('.spread-course-cover'),
            $desc = $el.find('.spread-course-des'),
            $face = $el.find('.spread-course-face'),
            $teacher = $face.find('img'),
            $count = $face.find('span').eq(1),
            $price = $el.find('.spread-course-price'),
            $default_price = $price.find('.price-origin');

      const href = $link.prop('href');

      let c_id = '';
      const reg = /\s/g;

      href.replace(/\/(\d+)\?/, (node, key) => c_id = parseInt(key));

      const data = {
        c_id,
        href,
        title: $link.attr('title'),
        img: $img.prop('src'),
        desc: $desc.text().replace(reg, ''),
        teacher_name: $teacher.attr('alt'),
        teacher_img: $teacher.prop('src'),
        count: parseInt($count.text()),
        price: parseInt($price.text().replace(reg, '').substr(1)),
        default_price: parseInt($default_price.text().replace(reg, '').substr(1)) || 0
      }

      result.push(data);
    })

    return result;
  }
})
