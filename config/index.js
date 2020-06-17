const { REDIS_CONF } = require('./db')

const isProd = process.env.NODE_ENV === 'production' ? true : false,
      BASE_URL = isProd
        ? 'http://bili.hlhs.store/'
        : 'http://localhost:8080/';

module.exports = {
  SESSION_INFO: {
    keys: ['QWERTYUIOPPOIUYTREWQ!@#$%^&'],
    name: 'jsplus.sid',
    prefix: 'jsplus.sess'
  },

  COOKIE_INFO: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },

  REDIS_INFO: {
    all: `${ REDIS_CONF[1] }:${ REDIS_CONF[0] }`
  },

  CRYTO_SECRET: '!@#$%^&*QWERT',

  CORS_ORIGIN: 'http://localhost:5013',

  OAUTH: {
    github: {
      client_id: '9beaa8453ffad1939f07',
      client_secret: 'e8b22ecd0eb00d9c7195ec37cf169dca6312e8cf'
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
    index: 'https://msiwei.ke.qq.com/#category=-1&tab=0',
    course: 'https://msiwei.ke.qq.com/#tab=1&category=-1',
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

  FIELDS:  {
    full: 'getDataFull',
    origin: 'getDataOrigin',
    bangumi: 'getDataBangumi',
    cinema: 'getDataCinema',
    rookie: 'getDataRookie',
    live: 'getDataLive',
    promote:'getDataPromote',
    e_sports:'getDataESports',
  },

  NAV: [
    { text: '全站', field: 'full' },
    { text: '推广', field: 'promote' },
    { text: '直播', field: 'live' },
    { text: '电竞赛事', field: 'e_sports' },
    { text: '原创', field: 'origin' },
    { text: '新人', field: 'rookie' },
    { text: '新番', field: 'bangumi' },
    { text: '影视', field: 'cinema' },
  ],

  QUERY: [
    { field: 'carousel', apiName: 'getDataCarousel' },
    { field: 'full', apiName: 'getDataFull' },
    { field: 'promote', apiName: 'getDataPromote' },
    { field: 'live', apiName: 'getDataLive' },
    { field: 'e_sports', apiName: 'getDataESports' },
    { field: 'origin', apiName: 'getDataOrigin' },
    { field: 'rookie', apiName: 'getDataRookie'},
    { field: 'bangumi', apiName: 'getDataBangumi' },
    { field: 'cinema', apiName: 'getDataCinema' },
  ],

   SEARCH_NAV : [
    { field: '*', text: '全部' },
    { field: 'full', text: '全站' },
    { field: 'promote', text: '推广' },
    { field: 'live', text: '直播' },
    { field: 'e_sports', text: '电竞赛事' },
    { field: 'origin', text: '原创' },
    { field: 'rookie', text: '新人' },
    { field: 'bangumi', text: '新番' },
    { field: 'cinema', text: '影视' },
  ]
}
