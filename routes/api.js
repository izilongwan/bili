const router = require('koa-router')(),
      controller = require('../controllers/api'),
      captchaController = require('../controllers/api/captcha'),
      confController = require('../controllers/api/conf'),
      { checkLoginState } = require('../middleware')

router.prefix('/api')
      .post('/', checkLoginState, controller.entry)
      .get('/captcha', captchaController.create)
      .get('/all_store', captchaController.allStore)
      .get('/conf', confController.getConfig)
      .get('/conf/ctx', checkLoginState, confController.ctxConfig)

module.exports = router;
