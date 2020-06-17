const crawler = require('../libs/crawler');
const { CRAWL_URL } = require('../config');

crawler({
  url: CRAWL_URL.index,
  callback () {
    const { $ } = window,
          $item = $('.agency-recommend-course'),
          result = [];

    $item.each((idx, el) => {
      const $el = $(el),
            $title = $el.find('.recommend-course-title span').eq(0),
            $group = $el.find('.rec-group'),
            $groupImg = $group.find('.rec-group-mask'),
            $groupLink = $group.find('.rec-group-join'),
            $list = $el.find('.course-card-list .item-img-link')

      const course_list = Array.from($list).reduce((prev, cur) => {
        const $cur = $(cur),
              c_id = parseInt($cur.attr('data-id')),
              href = $cur.prop('href'),
              img = $cur.find('img').prop('src');

        const data = { c_id, href, img };

        return prev.concat(data);
      }, []);

      const data = {
        c_id: idx + 1,
        title: $title.text().replace(/\s/g, ''),
        img: $groupImg.css('background-image'),
        qq_qun_href: $groupLink.prop('href'),
        course_list
      }

      result.push(data);
    })

    return result;
  }
})
