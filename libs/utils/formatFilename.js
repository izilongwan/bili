exports.formatFilename = (filename) => {
  return filename
    .replace(/\.js/, '')
    .replace(/(\w)/g, (_, key, idx) => {
      if (idx == 0) {
        return key.toLowerCase()
      }

      if (key === key.toUpperCase()) {
        return '_' + key.toLowerCase()
      }

      return key
    })
}