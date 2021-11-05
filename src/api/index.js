import { http } from '../utils/tools'
import API from './config'

const req = (method, params) => http({
  url: API.COMMON_API,
  method: 'post',
  data: {
    module: '/service/index',
    method,
    params,
  }
})

export const getData = (params) => req('getData', params)

export const serachData = (params) => req('searchData', params)
