exports.transferNum = (numStr) => {
  if (numStr.includes('万')) {
    return parseFloat(numStr) * 10000
  }

  return parseFloat(numStr)
}