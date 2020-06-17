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

const index = require('./routes/index')
const page = require('./routes/page')

const { SESSION_INFO, COOKIE_INFO, REDIS_INFO, CORS_ORIGIN } = require('./config');

// error handler
onerror(app)

app.use(cors({
  origin () {
    return CORS_ORIGIN;
  },
  credentials: true
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
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ ctx.method } ${ ctx.url } - ${ ms }ms`)
// })

// routes
app.use(index.routes(), index.allowedMethods())
   .use(page.routes(), page.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
