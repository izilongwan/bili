const app = require('../..');
const { addErrorArgs } = require('./addErrorArgs');

exports.createOrUpdateModel = (Model, data, customConf = {}) => {
  const result = [];

  data.forEach(async item => {
    const { href, title, author_name } = item
    const conf = {
      where: {
        href,
        title,
      },
      ...customConf,
    };

    author_name && (conf.where.author_name = author_name)

    let ret = null

    try {
      ret = await Model.findOne(conf);

      ret = ret
        ? await Model.update(item, conf)
        : await Model.create(item)
    }
    catch (error) {
      app.emit('error', addErrorArgs(error))
      ret = null
    }
    finally {
      ret && result.push(ret)
    }
  })

  return result
}
