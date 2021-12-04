const app = require('../..')
const { addErrorArgs } = require('./addErrorArgs')

exports.removeModelHrefs = async (Model, limit = 200, customConf = {}) => {
  const count = await Model.count()

  if (count <= limit) {
    return
  }

  limit = count - limit

  const conf = {
    limit,
    order: [['updatedAt', 'ASC']],
    raw: true,
    ...customConf,
  }

  try {

    let ret = await Model.findAll(conf)

    if (!ret) {
      return
    }

    const hrefs = ret.map(item => item.href)

    ret = await Model.destroy({
      where: {
        href: hrefs,
      }
    })

  } catch (error) {
    app.emit('error', addErrorArgs(error))
    console.log('🚀 ~ file: removeModelHrefs.js ~ line 23 ~ error', error)
  }
}
