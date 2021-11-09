const { Data } = require('../controllers/api/data')
class IndexService extends Data {
  constructor() {
    const conf = {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'status'],
      },
      where: { status: 1 }
    }
    super(conf)
  }
}

module.exports = new IndexService()
