const router = require('koa-router')(),
      controller = require('../controllers/page')

router.get('/', controller.home)
      .get('/list/:field?', controller.list)
      .get('/query/:field?', controller.query)
      .get('all', controller._404);

module.exports = router;
