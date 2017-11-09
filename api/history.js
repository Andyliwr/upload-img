import { History } from '../models'

export default function (router) {
    router.get('/api/search', async (ctx, next) => {
        let { type, search_str, sdate, edate, page, limit } = ctx.request.query
        // 格式化参数
        if (page) {
            page = parseInt(page)
            if (page < 1) {
                page = 1
            }
        } else {
            page = 1
        }
        if (limit) {
            limit = parseInt(limit)
        } else {
            limit = 10
        }

        if (type == 0) {
            if (search_str) {
                let queryResult = await History.find(
                    {
                        $or: [
                            { filename: { $regex: new RegExp(search_str, 'igm') } },
                            { old_filename: { $regex: new RegExp(search_str, 'igm') } }
                        ],
                    }).sort({ time: -1 })
                // 分页
                let total = queryResult.length
                queryResult = queryResult.slice((page - 1) * limit, page * limit)
                ctx.body = { ok: true, msg: '搜索成功', list: queryResult }
            } else {
                ctx.throw(500, '搜索字段不能为空')
            }
        } else if (type == 1) {
            if (sdate && edate) {
                let queryResult = await History.find(
                    {
                        time: {
                            "$gte": new Date(sdate),
                            "$lt": new Date(edate)
                        }
                    }).sort({ time: -1 })
                // 分页
                let total = queryResult.length
                queryResult = queryResult.slice((page - 1) * limit, page * limit)
                ctx.body = { ok: true, msg: '搜索成功', list: queryResult }
            } else {
                ctx.throw(500, '时间字段不能为空')
            }
        } else {
            ctx.throw(500, 'type字段传值错误')
        }
    })
}
