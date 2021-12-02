const { CRYTO_SECRET } = require('../../config'),
      crypto           = require('crypto')

exports.makeCrypto = (str) => {
  const _md5 = crypto.createHash('md5'),
        content = `${ CRYTO_SECRET }.${ str }.${ CRYTO_SECRET }`;

  return _md5.update(content).digest('hex');
}
