import { http } from '../utils/tools'
import API from './config'

const req = (method, params) => http({
  url: API.COMMON_API,
  method: 'post',
  data: {
    module: 'index',
    method,
    params: Object.assign({ filename: 'service' }, params)
  }
})

export const getData = (params) => req('getData', params)

export const serachData = (params) => req('searchData', params)
