exports.addErrorArgs = (error) => {
  Object.assign(error, getCallerFileNameAndLine(error))

  return error
}

function getCallerFileNameAndLine (error) {
  function getException () {
    try {
      throw Error('');
    } catch (error) {
      return error;
    }
  }

  const err = error
    ? error
    : getException();

  const stack = err.stack;
  const stackArr = stack.split('\n');

  let callerLogIndex = 0;
  for (let i = 0; i < stackArr.length; i++) {
    if (stackArr[i].indexOf('Error') > 0 && i + 1 < stackArr.length) {
      callerLogIndex = i;
      break;
    }
  }

  if (callerLogIndex >= 0) {
    const errorWhereValue = (stackArr[callerLogIndex + 1] || '').match(/\(.+?\)/)

    return {
      error_reason: stackArr[callerLogIndex],
      where: errorWhereValue ? errorWhereValue[0].slice(1, -1) : ''
    }

  } else {
    return {}
  }
}

exports.getCallerFileNameAndLine
