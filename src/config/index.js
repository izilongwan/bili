export const FIELDS = [
  { apiName: 'getDataFull', field: 'full' },
  { apiName: 'getDataPromote', field: 'promote' },
  { apiName: 'getDataLive', field: 'live' },
  { apiName: 'getDataESports', field: 'e_sports' },
  { apiName: 'getDataOrigin', field: 'origin' },
  { apiName: 'getDataRookie', field: 'rookie' },
  { apiName: 'getDataBangumi', field: 'bangumi' },
  { apiName: 'getDataCinema', field: 'cinema' },
]

export const isPrd = process.env.NODE_ENV === 'production'
  ? true
  : false;

export const SEARCH_NAV = [
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
