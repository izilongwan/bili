const { Data } = require('../controllers/api/data')
class IndexService extends Data {
  constructor() {
    super({ where: { status: 1 } })
  }
}

module.exports = new IndexService()
