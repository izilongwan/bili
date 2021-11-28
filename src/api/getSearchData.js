import { req } from './config'

export function getSearchData (params = {}) {
  return req({
    0: {
      module: '/service/index',
      method: 'searchData',
      params,
    },
    1: {
      module: '/service/index',
      method: 'getData',
      params: {
        field: 'all',
        num: 2,
        page: 2,
      },
    },
  })
}
