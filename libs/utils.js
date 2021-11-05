const cp               = require('child_process'),
      { resolve }      = require('path'),
      { CRYTO_SECRET } = require('../config'),
      crypto           = require('crypto'),
      fs               = require('fs'),
      path             = require('path'),
      { COMMON }       = require('./codeInfo')

const fsPromises = fs.promises

const privateList = ['crawler_settings', 'user']

const readDir = async (dir) => await fsPromises.readdir(__dirname + '/../' + dir)

const formatFilename = (filename) => {
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

const generateDirMap = async (dir) => {
  const dirs = await readDir(dir)

  return dirs.reduce((prev, curr) => {
    const key = formatFilename(curr)
    
    if (!privateList.includes(key)) {
      prev[formatFilename(curr)] = require(__dirname + '/../' + dir +'/' + curr)
    }

    return prev;
  }, {})
}

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

const createOrUpdateModel = (Model, data, customConf = {}) => {
  const result = [];

  data.forEach(async item => {
    const { title, author_name } = item
    const conf = {
      where: {
        title,
      },
      ...customConf,
    };

    author_name && (conf.where.author_name = author_name)

    let ret = await Model.findOne(conf);

    ret = ret
      ? await Model.update(item, conf)
      : await Model.create(item)

    result.push(ret)
  })

  return result
}

const updateModelAndReturnRet = async (Model, updateData, conf) => {
  const ret = await Model.update(updateData, conf)

  return ret[0] === 1
    ? { ...COMMON.SUCCESS, data: await Model.findOne(conf) }
    : COMMON.UPDATE_ERROR
}

// 检查参数
const checkParams = (obj = {}, ...params) => {
  for (const key of params) {
    if (obj[key] == undefined) {
      return false
    }
  }

  return true
}

const checkFileInfo = async (pathname) => {
  const ret = {
    exist: false,
    module: null
  };

  const filename = /^\//.test(pathname)
    ? path.resolve(__dirname, '..' + pathname + '.js')
    : path.resolve(__dirname, '../controllers/api/' + pathname + '.js')
  console.log('🚀 ~ file: utils.js ~ line 134 ~ checkFileInfo ~ filename', filename)

  try {
    const err = await fsPromises.access(filename)

    if (!err) {
      ret.module = require(filename)
      ret.exist = true
    }

  } catch (err) {
    ret.info = err
    console.log('🚀 ~ file: utils.js ~ line 120 ~ checkFileInfo ~ err', err)
  }

  return ret
}

function trimTxt(text) {
  return text.replace(/[\n\s]/g, '')
}

function transferNum(numStr) {
  if (numStr.includes('万')) {
    return parseFloat(numStr) * 10000
  }

  return parseFloat(numStr)
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
  createOrUpdateModel,
  updateModelAndReturnRet,
  checkParams,
  checkFileInfo,
  readDir,
  generateDirMap,
  trimTxt,
  transferNum,
  MODELS: generateDirMap('models'),
  CRAWLERS: generateDirMap('crawler'),
}
