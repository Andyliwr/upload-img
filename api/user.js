import { User } from '../models'

export default function (router) {
    router.post('/api/signin', async (ctx, next) => {
        let { nameOrEmail, password } = ctx.request.body

        ctx.body = await User.login(ctx, nameOrEmail, password)
    })

    router.post('/api/signup', async (ctx, next) => {
        let { username, email, password, repassword } = ctx.request.body
        if (password !== repassword) {
            ctx.body = { ok: false, msg: '两次密码不一致', user: null }
        } else {
            let user = new User({
                username: username,
                avatar: 'https://dummyimage.com/100x100/4A7BF7&text=' + username.substring(0, 1),
                email: email,
                password: password,
                history: [],
                settings: [],
                registe_time: new Date()
            })
            ctx.body = await User.add(ctx, user)
        }
    })

    router.get('/api/user', (ctx, next) => {
        if (ctx.session.user) {
            ctx.body = { ok: true, user: ctx.session.user }
        } else {
            ctx.body = { ok: false, user: null }
        }
    })

    router.get('/api/logout', (ctx, next) => {
        delete ctx.session.user
        ctx.body = { ok: true, msg: '退出成功' }
    })


    // 检验用户名是否重复
    router.get('/api/checkname', async (ctx, next) => {
        let name = ctx.request.query.name
        if (name) {
            ctx.body = await User.checkname(ctx, name)
        } else {
            ctx.body = { ok: true, msg: '用户名合法' }
        }
    })

    // 检验用户名是否重复
    router.get('/api/checkemail', async (ctx, next) => {
        let email = ctx.request.query.email
        if (email) {
            ctx.body = await models.user.checkemail(ctx, email)
        } else {
            ctx.body = { ok: true, msg: '邮箱合法' }
        }
    })
}
