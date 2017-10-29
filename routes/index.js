const createApi = require('../api')
const router = require('koa-router')()

// 创建api
createApi(router)

router.get('/', async(ctx, next) => {
    console.log(ctx.render('index', {
        title: '图片上传'
    }))
    await ctx.render('index', {
        title: '图片上传'
    })
})

router.get('/login', async(ctx, next) => {
    await ctx.render('login', {
        title: '登录'
    })
})

router.get('/registe', async(ctx, next) => {
    await ctx.render('registe', {
        title: '注册'
    })
})

router.get('/help', async(ctx, next) => {
    await ctx.render('help', {
        title: '使用帮助'
    })
})

router.get('/about', async(ctx, next) => {
    await ctx.render('about', {
        title: '关于我们'
    })
})

module.exports = router