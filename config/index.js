const { REDIS_CONF } = require('./db')

const isProd = process.env.NODE_ENV === 'production' ? true : false,
      BASE_URL = isProd
        ? '/'
        : 'http://localhost:8080/';

module.exports = {
  SESSION_INFO: {
    keys: ['QWERTYUIOPPOIUYTREWQ!@#$%^&'],
    name: 'admin_bili.sid',
    prefix: 'admin_bili.sess'
  },

  COOKIE_INFO: {
    path: '/',
    httpOnly: true,
    maxAge: 1000 * 60 * 30
  },

  REDIS_INFO: {
    all: `${ REDIS_CONF[1] }:${ REDIS_CONF[0] }`
  },

  CRYTO_SECRET: '!@#$%^&*QWERT',

  CORS_ORIGIN: isProd ? 'https://admin-bili.vercel.app' : 'http://localhost:3000',

  OAUTH: {
    github: {
      client_id: '',
      client_secret: ''
    }
  },

  QINIU: {
    keys: {
      ak: 'sK_GMiz-2C8-DJODMPHsDqKoB0Nz4Z8_ytlOVrjX',
      sk: 'bgxRp6b2CFJ33XvYfoRDTMjzXXae-bB3cHOUdUdv',
    },
    bucket: {
      tx_imgs: {
        name: 'stu-upload',
        domain: 'http://',
      }
    },
  },

  CRAWL_URL: {
    index: 'https://bilibili.com',
    full: 'https://www.bilibili.com/v/popular/rank/all',
    bangumi: 'https://www.bilibili.com/v/popular/rank/bangumi',
    rookie: 'https://www.bilibili.com/v/popular/rank/rookie',
    origin: 'https://www.bilibili.com/v/popular/rank/origin',
    movie: 'https://www.bilibili.com/v/popular/rank/movie',
  },

  CONF: {
    index: {
      meta: [
        { name: 'referrer', content: 'no-referrer' },
        { name: 'description', content: 'bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。' },
        { name: 'keywords', content: 'Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃' },
      ],
      title: '哔哩哔哩 (゜-゜)つロ 干杯~-bilibili',
      css: [
        BASE_URL + 'css/index.css'
      ],

      js: [
        BASE_URL + 'js/index.js'
      ]
    },

    list: {
      meta: [
        { name: 'referrer', content: 'no-referrer' },
        { name: 'description', content: 'bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。' },
        { name: 'keywords', content: 'B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid' }
      ],
      title: '更多 - 哔哩哔哩弹幕视频网 - ( ゜- ゜)つロ  乾杯~ ',
      css: [
        BASE_URL + 'css/list.css'
      ],

      js: [
        BASE_URL + 'js/list.js'
      ]
    },

    query: {
      meta: [
        { name: 'referrer', content: 'no-referrer' },
        { name: 'description', content: 'bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。' },
        { name: 'keywords', content: 'B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid' }
      ],
      title:  '搜索结果 - 哔哩哔哩弹幕视频网 - ( ゜- ゜)つロ  乾杯~ ',
      css: [
        BASE_URL + 'css/query.css'
      ],

      js: [
        BASE_URL + 'js/query.js'
      ]
    },

    notFound: {
      meta: [
        { name: 'referrer', content: 'no-referrer' },
        { name: 'description', content: 'bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。' },
        { name: 'keywords', content: 'B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid' }
      ],
      title: '未找到 - 哔哩哔哩弹幕视频网 - ( ゜- ゜)つロ  乾杯~ ',
      css: [
        BASE_URL + 'css/notFound.css'
      ],
      js: [
        BASE_URL + 'js/notFound.js'
      ]
    }
  },

  NAV: [
    { text: '全部', field: 'all' },
    { text: '全站', field: 'full' },
    { text: '推广', field: 'promote' },
    { text: '直播', field: 'live' },
    { text: '电竞赛事', field: 'e_sports' },
    { text: '原创', field: 'origin' },
    { text: '新人', field: 'rookie' },
    { text: '新番', field: 'bangumi' },
    { text: '电影', field: 'movie' },
  ],

  CRAWLER_SETTINGS: [
    {
      title: '爬取所有数据',
      field: 'all',
    },
    {
      title: '轮播图数据',
      field: 'carousel',
    },
    {
      title: '日常记录数据',
      field: 'record',
    },
    {
      title: '推广数据',
      field: 'promote',
    },
    {
      title: '电竞赛事数据',
      field: 'e_sports',
    },
    {
      title: '直播ing数据',
      field: 'live',
    },
    {
      title: '全站榜数据',
      field: 'full',
    },
    {
      title: '原创榜数据',
      field: 'origin',
    },
    {
      title: '新番榜数据',
      field: 'bangumi',
    },
    {
      title: '电影榜数据',
      field: 'movie',
    },
    {
      title: '新人榜数据',
      field: 'rookie',
    },
  ],

   SEARCH_NAV : [
    { field: 'all', text: '全部' },
    { field: 'full', text: '全站' },
    { field: 'promote', text: '推广' },
    { field: 'live', text: '直播' },
    { field: 'e_sports', text: '电竞赛事' },
    { field: 'origin', text: '原创' },
    { field: 'rookie', text: '新人' },
    { field: 'bangumi', text: '新番' },
    { field: 'movie', text: '电影' },
  ]
}
