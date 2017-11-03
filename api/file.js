const convert = require('koa-convert')
const body = require('koa-better-body')
const path = require('path')
export default function (router) {
  router.post('/api/uploader', convert(body({
    uploadDir: path.join(__dirname, '/../uploads'),
    keepExtensions: true
  })), async (ctx, next) => {
    console.log(ctx.request.files)
    // 判断user中的setting是否勾选自动压缩
    console.log(ctx.state.user)
  })
}
