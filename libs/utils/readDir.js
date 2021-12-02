const fs = require('fs')
const fsPromises = fs.promises

exports.readDir = async (dir) =>
  await fsPromises.readdir(__dirname + '/../../' + dir)
