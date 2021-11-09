const { Data } = require('../controllers/api/data')
class IndexService extends Data {
  constructor(conf = {}) {
    conf = {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'status'],
      },
      order: [['updatedAt', 'DESC']],
      where: { status: 1 },
      ...conf,
    }
    super(conf)
  }
}

module.exports = new IndexService()
