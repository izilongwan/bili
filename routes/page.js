const router = require('koa-router')(),
      controller = require('../controllers/page')

router.get('/', controller.index)
      .get('/list/:field?', controller.list)
      .get('/query/:field?', controller.query)
      .get('*', controller.notFound);

module.exports = router;
