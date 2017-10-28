var app = require('koa')(),
  logger = require('koa-logger'),
  json = require('koa-json'),
  views = require('koa-views'),
  onerror = require('koa-onerror'),
  session = require('koa-session');

var index = require('./routes/index');
var users = require('./routes/users');

// error handler
onerror(app);

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: 'jade'
}));
app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());
app.keys = ['davinci'];
const session_config = {
  key: 'koa:sess',
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
};
console.log(session(app)
    // app.use(session(session_config, app));

    app.use(function*(next) {
      var start = new Date;
      yield next;
      var ms = new Date - start;
      console.log('%s %s - %s', this.method, this.url, ms);
    });

    app.use(require('koa-static')(__dirname + '/public')); app.use(require('koa-static')(__dirname + '/bower_components'));

    // routes definition
    app.use(index.routes(), index.allowedMethods()); app.use(users.routes(), users.allowedMethods());

    // error-handling
    app.on('error', (err, ctx) => {
      console.error('server error', err, ctx)
    });

    module.exports = app;