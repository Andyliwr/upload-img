const mongoose = require('mongoose')
const md5 = require('../utils/md5')

const userSchema = new mongoose.Schema({
    username: String,
    avatar: String,
    email: String,
    password: String,
    history: Array,
    settings: Object
})

userSchema.statics.add = async function(ctx, user) {
    let document = await this.findOne({ email: user.email })
    if (document) {
        return { ok: false, msg: '此邮箱已注册' }
    }

    user.password = md5(user.password)
    let u = await user.save()
    user.password = null
    ctx.session.user = user

    return { ok: true, msg: '注册成功', user }
}

userSchema.statics.login = async function(ctx, email, password) {
    let user = await this.findOne({ email })

    if (user) {
        if (md5(password) === user.password) {
            user.password = null
            ctx.session.user = user
            return { ok: true, msg: '登录成功', user }
        }
        return { ok: false, msg: '密码错误', user }
    }

    return { ok: false, msg: '邮箱未注册', user }
}

userSchema.statics.checkname = async function(ctx, name) {
    let document = await this.findOne({ username: name })
    if (document) {
        return { ok: false, msg: '用户名已经存在' }
    } else {
        return { ok: true, msg: '用户名合法' }
    }
}

userSchema.statics.checkemail = async function(ctx, email) {
    let document = await this.findOne({ username: email })
    if (document) {
        return { ok: false, msg: '邮箱已经存在' }
    } else {
        return { ok: true, msg: '邮箱合法' }
    }
}

let User = mongoose.model('User', userSchema)

export { User }