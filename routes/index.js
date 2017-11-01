const createApi = require('../api')
const router = require('koa-router')()

// 创建api
createApi(router)

function getCookie(c_name, cookie) {
    if (cookie.length > 0) {
        var c_start = cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            var c_end = cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = cookie.length
            return unescape(cookie.substring(c_start, c_end))
        }
    }
    return ""
}

router.get('/', async (ctx, next) => {
    await ctx.render('index', {
        title: '图片上传',
        // logined: ctx.header.cookie ? (getCookie('ldk_upload_img', ctx.header.cookie) == '' ? false : true) : false
        user: ctx.state.user
    })
})

router.get('/login', async (ctx, next) => {
    await ctx.render('login', {
        title: '登录'
    })
})

router.get('/registe', async (ctx, next) => {
    await ctx.render('registe', {
        title: '注册'
    })
})

router.get('/help', async (ctx, next) => {
    await ctx.render('help', {
        title: '使用帮助'
    })
})

router.get('/about', async (ctx, next) => {
    await ctx.render('about', {
        title: '关于我们'
    })
})

module.exports = router
