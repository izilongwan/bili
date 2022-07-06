const movie = `
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
const carousel = `
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

module.exports = {
  movie,
  carousel,
}
