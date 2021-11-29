import { req } from './config'

export function getNav (params = {}) {
  return req({
    0: {
      module: 'service.index',
      method: 'getNav',
      params,
    },
  })
}
