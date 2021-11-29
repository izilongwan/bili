import { req } from './config'

export function getListData (params = {}) {
  return req({
    0: {
      module: 'service.index',
      method: 'getData',
      params,
    }
  })
}
