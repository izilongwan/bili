const fsPromises  = require('fs').promises,
      { resolve } = require('path'),
      app = require('../..')

exports.checkFileInfo = async (pathname) => {
  const ret = {
    exist: false,
    module: null
  };

  const filename = resolve(__dirname,
    (pathname.includes('.')
      ? '../../' + pathname.replace(/\./g, '/')
      : '../../controllers/api/' + pathname) + '.js'
  )

  console.log('🚀 ~ line 134 ~ checkFileInfo', filename)

  try {
    const err = await fsPromises.access(filename)

    if (!err) {
      ret.module = require(filename)
      ret.exist = true
    }

  } catch (error) {
    ret.info = error
    app.emit('error', addErrorArgs(error))
  }

  return ret
}
