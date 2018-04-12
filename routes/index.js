import { User, History } from '../models'
import moment from 'moment'
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

router.get('/about', async(ctx, next) => {
    let userNum = await User.count()
    let historyNum = await History.count()
    await ctx.render('about', {
        title: '关于',
        userNum: userNum,
        historyNum: historyNum
    })
})

router.get('/user', async(ctx, next) => {
    if (ctx.state.user) {
        // 获取我的历程
        let load = await History.dayLoad(ctx.state.user._id)
            // 获取最新的上传记录
        let hasUpload = await History.count({ userid: ctx.state.user._id })
            // 注册时间
        let thisUser = await User.findOne({ _id: ctx.state.user._id })
        if (load.length > 0) {
            load[load.length - 1].items.push({
                _id: moment(thisUser.registe_time.getTime()).format("YYYY-MM-DD"),
                is_registe: true,
                items: []
            })
        } else {
            load[0] = {}
            load[0].year = moment(thisUser.registe_time.getTime()).format("YYYY")
            load[0].items = [{
                _id: moment(thisUser.registe_time.getTime()).format("YYYY-MM-DD"),
                is_registe: true,
                items: []
            }]
        }
        await ctx.render('personal', {
            title: '个人中心',
            load: load,
            registe_time: moment(thisUser.registe_time.getTime()).format("YYYY-MM-DD"),
            hasUpload: hasUpload,
            settings: thisUser.settings
        })
    } else {
        ctx.status = 301
        ctx.body = '请先登陆';
        ctx.redirect('/login?backUrl=' + ctx.path);
    }
})

module.exports = router
