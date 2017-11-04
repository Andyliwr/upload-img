import { User } from './user'
const mongoose = require('mongoose')

const historySchema = new mongoose.Schema({
    filename: String,
    old_filesize: String,
    filesize: String,
    userid: mongoose.Schema.ObjectId, // 所属人
    tmp_url: String, // 腾讯云临时地址
    remote_url: String, // 七牛永久地址
    time: Date
})

historySchema.statics.add = async function(history) {
    let a = await history.save()
    if (a) {
        let b = await User.update({ _id: history.userid }, { '$addToSet': { history: history.id } })
        console.log('插入history后，更新User: ', b)
        if (b.ok == 1 && b.nModified == 1) {
            return 1
        } else {
            return 0
        }
    } else {
        return -1
    }
}

historySchema.statics.transId = async function(id) {
    return mongoose.Types.ObjectId(id)
}

let History = mongoose.model('History', historySchema)

export { History }