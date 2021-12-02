const { ENTRY } = require('../codeInfo')

exports.checkAccess = (access) => {
  switch (access) {
    case 0:
      return [false, ENTRY.NO_ACCESS]

    case 1: // 通过
      return [true]

    case -1:
      return [false, ENTRY.NOT_LOGIN]

    default:
      return [false, ENTRY.NO_ACCESS]
  }
}