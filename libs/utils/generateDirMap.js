const privateList = ['crawler_settings', 'user']
const { readDir } = require('./readDir')
const { formatFilename } = require('./formatFilename')

exports.generateDirMap = async (dir) => {
  const dirs = await readDir(dir)

  return dirs.reduce((prev, curr) => {
    const key = formatFilename(curr)

    if (!privateList.includes(key)) {
      prev[key] = require(__dirname + '/../../' + dir +'/' + curr)
    }

    return prev;
  }, {})
}
