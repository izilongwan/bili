const router            = require('koa-router')(),
      controller        = require('../controllers/api'),
      captchaController = require('../controllers/api/captcha'),
      confController    = require('../controllers/api/conf'),
      { checkAccess, } = require('../middleware')

router.prefix('/api')
      .post('/', checkAccess, controller.entry)
      .get('/captcha', captchaController.create)
      .get('/all_store', captchaController.allStore)
      .get('/conf', confController.getConfig)
      .get('/conf/ctx', checkAccess, confController.ctxConfig)

module.exports = router;
