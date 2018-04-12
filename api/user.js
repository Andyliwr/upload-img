import { User } from '../models'
import crypto from 'crypto'
import Identicon from 'identicon.js'

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
            let hash = crypto.createHash('md5')
            hash.update(username);
            let imgData = new Identicon(hash.digest('hex')).toString()
            let user = new User({
                username: username,
                avatar: 'data:image/png;base64,'+imgData,
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

    // 更新用户设置
    router.post('/api/setting', async (ctx, next) => {
        // format params
        if(ctx.request.body && ctx.request.body.setting instanceof Array){
            let settings = ctx.request.body.setting.map(item => {
                return {
                    stname: item.stname,
                    value: item.value === 'false' ? false : (item.value === 'true' ? true : item.value)
                }
            })
            let update = await User.update({ _id: ctx.session.user._id }, {$set: {
                settings
            }})
            if(update.ok){
                ctx.session.user.settings = settings
                ctx.body = {
                    ok: true,
                    msg: '更新设置成功'
                } 
            }else{
                ctx.body = {
                    ok: false,
                    msg: '更新设置失败'
                }
            }
        } else {
            ctx.body = {
                ok: false,
                msg: '参数不合法'
            }
        }
    })
}
