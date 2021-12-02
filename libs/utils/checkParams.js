exports.checkParams = (obj = {}, ...params) => {
  for (const key of params) {
    if (obj[key] == undefined) {
      return false
    }
  }

  return true
}