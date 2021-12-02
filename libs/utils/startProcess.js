const cp = require('child_process')

exports.startProcess = (opts) => {
  return new Promise((_resolve) => {
    const script = resolve(__dirname, opts.path),
          child = cp.fork(script, []);

    let invoked = false;

    child.on('message', data => _resolve(opts.message(data)));

    child.on('exit', code => {
      if (invoked) {
        return;
      }

      invoked == true;
      opts.exit(code);
    })

    child.on('error', error => {
      if (invoked) {
        return;
      }

      invoked = true;
      _resolve(opts.error(error));
    })
  })
}