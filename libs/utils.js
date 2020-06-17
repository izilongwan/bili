const cp = require('child_process'),
      { resolve } = require('path');


const makeCrypto = (str) => {
  const _md5 = crypto.createHash('md5'),
        content = `${ CRYTO_SECRET }.${ str }.${ CRYTO_SECRET }`;

  return _md5.update(content).digest('hex');
}

const asyncFunc = async (fn) => {
  try {
    const data = await fn();

    return [null, data];

  } catch (err) {

    return [err, null];
  }
}

const uploadImg = (data) => {
  data.map(async (item) => {
    const { imgUrl, img_key, url } = item;

    if (imgUrl && img_key) {
      try {
        const conf = {
          url,
          bucket: QINIU.bucket.tx_imgs.name,
          ak: QINIU.keys.ak,
          sk: QINIU.keys.sk,
          ext: '.jpg'
        }

        const data = await qiniuUpload(conf);

        data.key && (item.key = data.key);
      } catch (err) {
        console.log('err', err);
      }
    }
  })
}

const updateModel = (Model, data) => {
  data.forEach(async item => {
    const { c_id } = item,
      conf = { where: { c_id } };

    const res = await Model.findOne(conf);

    if (res) {
      await Model.update(item, conf);
      return;
    }

    await Model.create(item);
  })
}

const updateBiliModel = (Model, data) => {
  data.forEach(async item => {
    const { title, author_name } = item,
          conf = {
            where: {
              title,
              author_name
            }
          };

    const res = await Model.findOne(conf);

    if (res) {
      await Model.update(item, conf);
      return;
    }

    await Model.create(item);
  })
}

module.exports = {
  startProcess (opts) {
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
  },

  qiniuUpload (opts) {
    // const mac = new Qiniu().auth.digest.Mac(opts.ak, opts.sk),
    //       conf = new Qiniu.conf.Config(),
    //       client = new Qiniu.rs.BucketManager(mac, conf),
    //       key = nanoid() + opts.ext;

    // return new Promise((resolve, reject) => {
    //   client.fetch(opt.url, opt.bucket, key, (err, ret, info) => {
    //     if (err) {
    //       reject(err);
    //       return;
    //     }

    //     if (info.statusCode === 200) {
    //       resolve({ key });
    //       return;
    //     }

    //     reject(info);
    //   })
    // })
  },

  makeCrypto,
  asyncFunc,
  uploadImg,
  updateModel,
  updateBiliModel
}
