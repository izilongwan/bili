const movieStr = `
  const puppeteer_pg_ = 'puppeteer_pg_'
  const trimTxt       = window['puppeteer_pg_trimTxt']
  const transferNum   = window['puppeteer_pg_transferNum']
  const autoScroll = window['puppeteer_pg_autoScroll']
  const maxY = document.body.scrollHeight - window.innerHeight
  const $items = $('.hover-c')

  const getLastCallback = function() {
    const $lastItem = $('.hover-c').last()
    const lastImgSrc = $lastItem.find('.season-cover .img').prop('src')
    return lastImgSrc
  }

  autoScroll(getLastCallback, Infinity)

  const result = []

  $items.each(async (idx, val) => {
    const $val = $(val)
    const $bottom = $val.find('.hover-item').next()

    const data = {
      img: $val.find('source').attr('srcset'),
      title: $bottom.find('.title').text(),
      latest_tip: $bottom.find('.desc').text(),
      href: $bottom.find('a').prop('href'),
      score: $val.find('.score').text(),
      play_count: 0,
      popup_count: 0,
      fav_count: 0,
      tags: '电影',
    }

    result.push(data)
  })

  result
`
const carouselStr = `
  const puppeteer_pg_ = 'puppeteer_pg_'
  const trimTxt       = window['puppeteer_pg_trimTxt']
  const transferNum   = window['puppeteer_pg_transferNum']
  const autoScroll = window['puppeteer_pg_autoScroll']
  const $items = $('.carousel-slide .carousel-item')

  const getLastCallback = function() {
    const $lastItem = $('.carousel-slide .carousel-item').last()
    const lastImgSrc = $lastItem.find('a img').prop('src')
    return lastImgSrc
  }

  autoScroll(getLastCallback, 0)

  const result = []

  $items.each((idx, val) => {
    const $val = $(val)
    const $img = $val.find('img')

    const data = {
      img: $val.find('source').attr('srcset'),
      title: $img.attr('title') || $img.attr('alt'),
      href: $val.prop('href'),
    }

    result.push(data)
  })

  result
`

const CRAWLER_SETTINGS = [
  {
    title: '爬取所有数据',
    field: 'all',
  },
  {
    title: '轮播图数据',
    field: 'carousel',
    url: 'https://www.bilibili.com/',
    originEvalStr: carouselStr,
    evalStr: carouselStr,
  },
  {
    title: '日常记录数据',
    field: 'record',
    url: 'https://www.bilibili.com/',
  },
  {
    title: '推广数据',
    field: 'promote',
    url: 'https://www.bilibili.com/',
  },
  {
    title: '电竞赛事数据',
    field: 'e_sports',
    url: 'https://www.bilibili.com/',
  },
  {
    title: '直播ing数据',
    field: 'live',
    url: 'https://www.bilibili.com/',
  },
  {
    title: '全站榜数据',
    field: 'full',
    url: 'https://www.bilibili.com/',
  },
  {
    title: '原创榜数据',
    field: 'origin',
    url: 'https://www.bilibili.com/',
  },
  {
    title: '新番榜数据',
    field: 'bangumi',
    url: 'https://www.bilibili.com/',
  },
  {
    title: '电影榜数据',
    field: 'movie',
    url: 'https://www.bilibili.com/movie',
    originEvalStr: movieStr,
    evalStr: movieStr,
  },
  {
    title: '新人榜数据',
    field: 'rookie',
    url: 'https://www.bilibili.com/',
  },
]

const isProd = process.env.NODE_ENV === 'production' ? true : false

const CRAWL_INTERVAL = 1000 * (isProd ? 10 : 1)

const LAUNCH_CONFIG = {
    timeout: 10 * 60 * 1000,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }

module.exports = {
  CRAWLER_SETTINGS,
  CRAWL_INTERVAL,
  LAUNCH_CONFIG,
}
