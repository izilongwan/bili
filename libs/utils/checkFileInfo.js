const fsPromises  = require('fs').promises,
      { resolve } = require('path')

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

  console.log('🚀 ~ file: utils.js ~ line 134 ~ checkFileInfo ~ filename', filename)

  try {
    const err = await fsPromises.access(filename)

    if (!err) {
      ret.module = require(filename)
      ret.exist = true
    }

  } catch (err) {
    ret.info = err
    console.log('🚀 ~ file: utils.js ~ line 120 ~ checkFileInfo ~ err', err)
  }

  return ret
}