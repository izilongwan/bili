export const isPrd = process.env.NODE_ENV === 'production'
  ? true
  : false;

export const SEARCH_NAV = [
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
