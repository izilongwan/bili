exports.asyncFunc = async (fn) => {
  try {
    const data = await fn();

    return [null, data];

  } catch (err) {

    return [err, null];
  }
}