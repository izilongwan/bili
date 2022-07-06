const PageElement = require('../../models/PageElement')
const { COMMON } = require('../../libs/codeInfo');

class PageElementEval {
  async getAll(ctx, next) {
    const conf = {
      attributes: {
        exclude: ['createdAt']
      },
      raw: true,
    }
    const data = await PageElement.findAll(conf)

    return { ...COMMON.SUCCESS, data }
  }

  update() {

  }
}

module.exports = new PageElementEval()
