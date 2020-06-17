import axios from 'axios'
import API from './config'

export const getData = (data) =>
  axios({
    url: API.GET_DATA,
    method: 'post',
    data,
  })


export const getSerachData = (data) =>
  axios({
    url: API.GET_SEARCH_DATA,
    method: 'post',
    data,
  })
