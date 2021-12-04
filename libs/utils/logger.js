const fs = require('fs');

const options = {
  flags: 'a',
  encoding: 'utf8',
}

exports.logger = (path) => {
  const filename = generatorLogFileName(path),
        stdout = generatorWriteStream(filename),
        logger = new console.Console(stdout)

  logAppendDate(logger)

  return logger
}

function logAppendDate(logger) {
  const loggerLogFunc = logger.log

  logger.log = (str) => {
    return loggerLogFunc.call(logger, `[%s] %s %s`, new Date().toLocaleString(), str, '\n')
  }

  return logger
}

function generatorWriteStream(filename) {
  return fs.createWriteStream(filename, options)
}

function generatorLogFileName (path, ext = 'log') {
  const nowDate = new Date()

  const year = nowDate.getFullYear(),
        month = nowDate.getMonth() + 1,
        date = nowDate.getDate()

  return `${path}/${year}-${month}-${date}.${ext}`
}
