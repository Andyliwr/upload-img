import { History } from '../models'
import moment from 'moment'

function bytesToSize(bytes) {
    if (bytes === 0) return '0 B';
    let k = 1000, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

export default function(router) {
    router.get('/api/history/search', async(ctx, next) => {
        if (ctx.state.user) {
            let { type, search_str, sdate, edate, page, limit } = ctx.request.query
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
                    let queryResult = await History.find({
                            userid: await History.transId(ctx.state.user._id),
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
                    let queryResult = await History.find({
                            userid: await History.transId(ctx.state.user._id),
                            time: {
                                "$gte": new Date(sdate),
                                "$lt": new Date(edate)
                            }
                        }).sort({ time: -1 })
                        // 分页
                    let total = queryResult.length
                    queryResult = queryResult.slice((page - 1) * limit, page * limit)
                    ctx.body = {
                        ok: true,
                        msg: '搜索成功',
                        total: total,
                        list: queryResult
                    }
                } else {
                    ctx.throw(500, '时间字段不能为空')
                }
            } else {
                ctx.throw(500, 'type字段传值错误')
            }
        } else {
            ctx.status = 301
            ctx.body = '请先登陆';
            ctx.redirect('/login?backUrl=' + ctx.path);
        }
    })

    router.get('/api/history/list', async(ctx, next) => {
        if (ctx.state.user) {
            let { page, limit } = ctx.request.query
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
            let result = await History.find({
                    userid: await History.transId(ctx.state.user._id)
                }, ['old_filename', 'filesize', 'remote_url', 'time'])
                .sort({ time: -1 })

            // 分页
            let total = result.length
            result = result.slice((page - 1) * limit, page * limit)

            // 格式化时间和文件大小
            let newResult = []
            result.forEach(item => {
                newResult.push({
                    old_filename: item.old_filename,
                    filesize: bytesToSize(item.filesize),
                    remote_url: item.remote_url,
                    time: moment(item.time.getTime()).format("YYYY-MM-DD HH:MM:SS")
                })
            })

            ctx.body = {
                ok: true,
                msg: '获取历史记录成功',
                total: total,
                list: newResult
            }
        } else {
            ctx.status = 301
            ctx.body = '请先登陆';
            ctx.redirect('/login?backUrl=' + ctx.path);
        }
    })
}