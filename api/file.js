import { History } from '../models'
import convert from 'koa-convert'
import body from 'koa-better-body'
import path from 'path'
import qn from 'qn'

const minify = require('../utils/minify')
const config = require('../config')

// qiniu上传设置
const client = qn.create({
    accessKey: config.accessKey,
    secretKey: config.secretKey,
    bucket: 'upload',
    origin: 'http://oyh0gj8ht.bkt.clouddn.com',
});

export default function (router) {
    router.post('/api/uploader', convert(body({
        uploadDir: path.join(__dirname, '/../uploads'),
        keepExtensions: true
    })), async (ctx, next) => {
        // 判断user中的setting是否勾选自动压缩
        if (ctx.state.user) {
            // 是否启用图片压缩
            let isYaSuo = false
            ctx.state.user.settings.forEach(item => {
                if ((item.stname === 'compress') && item.value) {
                    isYaSuo = true
                }
            })
            if (isYaSuo) {
                for (let i = 0; i < ctx.request.files.length; i++) {
                    let uploadType = ''
                    let fileName = ctx.request.files[i].name
                    switch (ctx.request.files[i].type) {
                        case 'image/png':
                            uploadType = '.png'
                            break
                        case 'image/jpg':
                            uploadType = '.jpg'
                            break
                        case 'image/jpeg':
                            uploadType = '.jpg'
                            break
                        case 'image/gif':
                            uploadType = '.gif'
                            break
                        case 'image/bmp':
                            uploadType = '.bmp'
                            break
                        default:
                            break
                    }
                    let compressObj = await minify(ctx.request.files[i].path)
                    let compressUrl = ''
                    if (compressObj instanceof Array && compressObj.length == 1) {
                        compressUrl = compressObj[0].path
                    } else {
                        compressUrl = ctx.request.files[i].path
                    }
                    if (uploadType) {
                        return new Promise((resolve, reject) => {
                            client.uploadFile(compressUrl, { key: (new Date()).getTime() + uploadType }, function (err, result) {
                                if (err) {
                                    ctx.throw(500, '图片上传失败')
                                    return reject(err)
                                } else {
                                    console.log('七牛上传成功！')
                                        // save history
                                        (async function () {
                                            let history = new History({
                                                filename: result.key,
                                                old_filename: fileName,
                                                filesize: parseFloat(result['x:size']),
                                                userid: await History.transId(ctx.state.user._id), // 所属人
                                                tmp_url: compressUrl, // 腾讯云临时地址
                                                remote_url: result.url, // 七牛永久地址
                                                time: new Date()
                                            })
                                            let isOk = await History.add(history, true)
                                            if (isOk == 1) {
                                                ctx.body = {
                                                    ok: true,
                                                    msg: '图片上传成功',
                                                    data: result
                                                }
                                                resolve()
                                            } else if (isOk == 0) {
                                                ctx.throw(500, '更新History之后更新User.history失败')
                                            } else if (isOk == -1) {
                                                ctx.throw(500, '更新History失败')
                                            }
                                        })()
                                }
                            })
                        })
                    } else {
                        ctx.throw(500, '图片格式不支持')
                    }
                }
            } else {
                for (let i = 0; i < ctx.request.files.length; i++) {
                    let uploadType = ''
                    let fileName = ctx.request.files[i].name
                    switch (ctx.request.files[i].type) {
                        case 'image/png':
                            uploadType = '.png'
                            break
                        case 'image/jpg':
                            uploadType = '.jpg'
                            break
                        case 'image/jpeg':
                            uploadType = '.jpg'
                            break
                        case 'image/gif':
                            uploadType = '.gif'
                            break
                        case 'image/bmp':
                            uploadType = '.bmp'
                            break
                        default:
                            break
                    }
                    if (uploadType) {
                        return new Promise((resolve, reject) => {
                            client.uploadFile(ctx.request.files[i].path, { key: (new Date()).getTime() + uploadType }, function (err, result) {
                                if (err) {
                                    ctx.throw(500, '图片上传失败')
                                    return reject(err)
                                } else {
                                    // save history
                                    (async function () {
                                        let history = new History({
                                            filename: result.key,
                                            old_filename: fileName,
                                            filesize: parseFloat(result['x:size']),
                                            userid: await History.transId(ctx.state.user._id), // 所属人
                                            tmp_url: ctx.request.files[i].path, // 腾讯云临时地址
                                            remote_url: result.url, // 七牛永久地址
                                            time: new Date()
                                        })
                                        let isOk = await History.add(history, true)
                                        if (isOk == 1) {
                                            ctx.body = {
                                                ok: true,
                                                msg: '图片上传成功',
                                                data: result
                                            }
                                            resolve()
                                        } else if (isOk == 0) {
                                            ctx.throw(500, '更新History之后更新User.history失败')
                                        } else if (isOk == -1) {
                                            ctx.throw(500, '更新History失败')
                                        }
                                    })()
                                }
                            })
                        })
                    } else {
                        ctx.throw(500, '图片格式不支持')
                    }
                }
            }
        } else {
            for (let i = 0; i < ctx.request.files.length; i++) {
                let uploadType = ''
                let fileName = ctx.request.files[i].name
                switch (ctx.request.files[i].type) {
                    case 'image/png':
                        uploadType = '.png'
                        break
                    case 'image/jpg':
                        uploadType = '.jpg'
                        break
                    case 'image/jpeg':
                        uploadType = '.jpg'
                        break
                    case 'image/gif':
                        uploadType = '.gif'
                        break
                    case 'image/bmp':
                        uploadType = '.bmp'
                        break
                    default:
                        break
                }
                if (uploadType) {
                    return new Promise((resolve, reject) => {
                        client.uploadFile(ctx.request.files[i].path, { key: (new Date()).getTime() + uploadType }, function (err, result) {
                            if (err) {
                                ctx.throw(500, '图片上传失败')
                                return reject(err)
                            } else {
                                // save history
                                (async function () {
                                    let history = new History({
                                        filename: result.key,
                                        old_filename: fileName,
                                        filesize: parseFloat(result['x:size']),
                                        userid: null, // 所属人
                                        tmp_url: ctx.request.files[i].path, // 腾讯云临时地址
                                        remote_url: result.url, // 七牛永久地址
                                        time: new Date()
                                    })
                                    let isOk = await History.add(history, false)
                                    if (isOk == 1) {
                                        ctx.body = {
                                            ok: true,
                                            msg: '图片上传成功',
                                            data: result
                                        }
                                        resolve()
                                    } else if (isOk == -1) {
                                        ctx.throw(500, '更新History失败')
                                    }
                                })()
                            }
                        })
                    })
                } else {
                    ctx.throw(500, '图片格式不支持')
                }
            }
        }
    })
}
