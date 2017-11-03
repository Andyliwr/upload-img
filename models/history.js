const mongoose = require('mongoose')

const historySchema = new mongoose.Schema({
  filename: String,
  old_filesize: String,
  filesize: String,
  userid: String, // 所属人
  tmp_url: String, // 腾讯云临时地址
  remote_url: Array // 七牛永久地址
})

historySchema.statics.add = async function (ctx, user) {
  // let document = await this.findOne({ email: user.email })
  // if (document) {
  //   return { ok: false, msg: '此邮箱已注册' }
  // }
  // user.password = md5(user.password)
  // let u = await user.save()
  // user.password = null
  // ctx.session.user = user

  // return { ok: true, msg: '注册成功', user }
}

let History = mongoose.model('User', historySchema)

export { History }
