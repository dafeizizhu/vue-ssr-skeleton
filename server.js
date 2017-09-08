const Koa = require('koa')
const path = require('path')
const serve = require('koa-static')
const logger = require('koa-logger')
const session = require('koa-session')
const mount = require('koa-mount')
const fs = require('fs')

const vueRender = require('./lib/vue-render')

const SESSION_CONFIG = {
  key: 'vue-ssr-skeleton'
}
const PORT = 12345

const app = new Koa()

app.keys = ['vue-ssr-skeleton']

var render = vueRender(app, fs.readFileSync(path.resolve(__dirname, './src/index.template.html'), 'utf-8'))

require('koa-qs')(app)

if (process.env.NODE_ENV == 'dev') app.use(logger())

app.use(session(SESSION_CONFIG, app))
app.use(async ctx => {
  ctx.type = 'html'
  ctx.body = await render({ url: ctx.url, title: 'Vue SSR Skeleton' })
})

app.listen(PORT)

process.on('SIGINT', () => {
  process.exit(0)
})
process.on('unhandledRejection', (reason, p) => {
  console.warn('Unhandled Rejection at:', p, 'reason:', reason)
  process.exit(1)
})
process.on('uncaughtException', err => {
  console.warn('uncaughtException', err)
  process.exit(1)
})
