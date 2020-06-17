const router = require('koa-router')(),
      controller = require('../controllers/index');

router.prefix('/api/data')
      .post('/get_data', controller.getData)
      .post('/search_data', controller.searchData)

module.exports = router;
