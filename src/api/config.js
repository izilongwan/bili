import { isPrd } from '../config'

const BASE_URL = isPrd
  ? `http://bili.hlhs.store/api/data/`
  : 'http://localhost:5013/api/data/'

export default {
  GET_DATA: BASE_URL + 'get_data',
  GET_SEARCH_DATA: BASE_URL + 'search_data'
}
