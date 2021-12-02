exports.getTime = (ts) => {
  const allSecond = ~~(ts / 1000),
        hour = ~~(allSecond / (60 * 60)),
        minute = ~~((allSecond - hour * 60 * 60) / 60),
        second = allSecond - hour * 60 * 60 - minute * 60

  return {
    hour,
    minute,
    second,
  }
}
