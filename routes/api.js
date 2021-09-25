const router = require('koa-router')(),
      controller = require('../controllers/api'),
      captchaController = require('../controllers/api/captcha')

router.prefix('/api')
      .post('/', controller.entry)
      .get('/captcha', captchaController.create)
      .get('/env', captchaController.env)
      .get('/all_store', captchaController.allStore)
      .get('/config', captchaController.getConfig)

module.exports = router;
