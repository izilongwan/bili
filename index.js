const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const Kredis = require('koa-redis')
const session = require('koa-generic-session')
const cors = require('koa2-cors')
const koaStatic = require('koa-static')

const api = require('./routes/api')
const page = require('./routes/page')
const { logger } = require('./libs/utils')

const catchError = require('./middleware/catchError')

const { SESSION_INFO, COOKIE_INFO, REDIS_INFO, corsOrigin } = require('./config');

const port = 5001

setTimeout(() => {
  require('./models/CrawlerSettings')
  require('./controllers/api/crawler')
}, 1000 * 5);

// error handler
onerror(app)

// 中间件处理错误
app.use(catchError)

app.use(cors({
  // exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  // allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  origin (ctx) {
    return corsOrigin(ctx);
  },
  credentials: true // 允许跨域设置cookie，前端设置widthCredential
}))

// middlewares
const types = {
  enableTypes: ['json', 'form', 'text']
}
app.use(bodyparser(types))
   .use(json());

// app.use(logger())

app.use(koaStatic(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

app.keys = SESSION_INFO.keys;
app.use(session({
  key: SESSION_INFO.name,
  prefix: SESSION_INFO.prefix,
  cookie: COOKIE_INFO,
  store: Kredis(REDIS_INFO)
}))

// logger
app.use(async (ctx, next) => {
  ctx.response.timeStart = Date.now()

  await next()
})

// routes
app.use(api.routes(), api.allowedMethods())
   .use(page.routes(), page.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  const log = logger(__dirname + '/logs')
  console.log('--------------------------Server Error--------------------------');
  log.log(err)
  console.log(err)
  console.log('--------------------------Server Error--------------------------');
});

app.listen(port, () => console.log(`Server is running on PORT ${ port }`))

module.exports = app
