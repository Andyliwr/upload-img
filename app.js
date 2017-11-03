const Koa = require('koa')
const app = new Koa()
const path = require('path')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const body = require('koa-better-body')
const logger = require('koa-logger')
const session = require('koa-session2')
const Store = require("./utils/store")

const index = require('./routes/index')

// error handler
onerror(app)

// middlewares
app.use(bodyparser())
// uploads
app.use(body({
    uploadDir: path.join(__dirname, 'uploads'),
    keepExtensions: true
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(require('koa-static')(__dirname + '/bower_components'))
app.use(session({
    key: "ldk_upload_img",
    store: new Store()
}));
app.use(views(__dirname + '/views', {
    extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// user info
app.use(async (ctx, next) => {
    ctx.state.user = ctx.session.user
    await next()
})

// routes
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
