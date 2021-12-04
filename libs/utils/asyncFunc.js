exports.asyncFunc = async (fn) => {
  try {
    const data = await fn();

    return [null, data];

  } catch (error) {

    return [error, null];
  }
}