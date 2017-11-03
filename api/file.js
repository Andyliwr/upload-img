export default function (router) {
  router.post('/api/uploader', async (ctx, next) => {
    console.log(ctx.req.files)
    ctx.body = {
      a: 1
    }
  })
}
