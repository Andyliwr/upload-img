import { User } from './user'
const mongoose = require('mongoose')

const historySchema = new mongoose.Schema({
    filename: String,
    old_filename: String,
    filesize: Number,
    userid: mongoose.Schema.ObjectId, // 所属人
    tmp_url: String, // 腾讯云临时地址
    remote_url: String, // 七牛永久地址
    time: Date
})

historySchema.statics.add = async function (history, needUpdateUser) {
    let a = await history.save()
    if (a) {
        if (needUpdateUser) {
            let b = await User.update({ _id: history.userid }, { '$addToSet': { history: history.id } })
            if (b.ok == 1 && b.nModified == 1) {
                return 1
            } else {
                return 0
            }
        } else {
            return 1
        }
    } else {
        return -1
    }
}

historySchema.statics.transId = async function (id) {
    return mongoose.Types.ObjectId(id)
}

historySchema.statics.dayLoad = async function (userid) {
    let a = await this.aggregate([
        {
            $match: {
                "userid": mongoose.Types.ObjectId(userid)
            }
        },
        {
            $project: {
                day: {
                    $substr: [{ "$add": ["$time", 28800000] }, 0, 10]
                },
                "old_filename": 1,
                "remote_url": 1
            }
        },
        {
            $group: {
                _id: "$day",
                "upload_arr": { $push: { name: "$old_filename", link: "$remote_url" } }
            }
        },
        {
            $sort: {
                "_id": -1
            }
        }
    ])

    // 整理文档
    let allYear = []
    let result = []
    a.forEach(item => {
        let year = item._id.substring(0, 4)
        let index = allYear.indexOf(year)
        if (index > -1) {
            result[index].items.push(item)
        } else {
            allYear.push(year)
            result.push({
                year: year,
                items: [item]
            })
        }
    })
    return result
}

let History = mongoose.model('History', historySchema)

export { History }
