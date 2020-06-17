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
