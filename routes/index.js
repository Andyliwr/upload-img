const router = require('koa-router')();

router.get('/', function *(next) {
  yield this.render('index', {
    title: '图片上传'
  });
});

router.get('/foo', function *(next) {
  yield this.render('index', {
    title: '个人中心'
  });
});

router.get('/login', function *(next) {
  yield this.render('login', {
    title: '登录'
  });
});

module.exports = router;
