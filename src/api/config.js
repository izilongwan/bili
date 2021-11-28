import { http } from '../utils/tools'

const COMMON_API = `/api`

export const req = (params, url = COMMON_API) => http({
  url,
  method: 'POST',
  data: {
    params,
  }
})

export {
  COMMON_API,
}
