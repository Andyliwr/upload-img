import { User, History } from '../models'
const createApi = require('../api')
const router = require('koa-router')()

// 创建api
createApi(router)

router.get('/', async(ctx, next) => {
    await ctx.render('index', {
        title: '图片上传',
        user: ctx.state.user
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
    let userNum = await User.count()
    let historyNum = await History.count()
    console.log(userNum, historyNum)
    await ctx.render('about', {
        title: '关于',
        userNum: userNum,
        historyNum: historyNum
    })
})

router.get('/user', async(ctx, next) => {
    await ctx.render('personal', {
        title: '个人中心'
    })
})

module.exports = router