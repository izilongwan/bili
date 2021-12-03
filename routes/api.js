const router            = require('koa-router')(),
      controller        = require('../controllers/api'),
      captchaController = require('../controllers/api/captcha'),
      confController    = require('../controllers/api/conf'),
      { checkAccess, } = require('../middleware')

router.prefix('/api')
      .post('/', checkAccess, controller.entry.bind(controller))
      .get('/captcha', captchaController.create.bind(captchaController))
      .get('/all_store', captchaController.allStore.bind(captchaController))
      .get('/conf', confController.getConfig.bind(confController))
      .get('/conf/ctx', checkAccess, confController.ctxConfig.bind(confController))

module.exports = router;
