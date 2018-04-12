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
    origin: 'https://fs.andylistudio.com',
});

export default function(router) {
    router.post('/api/uploader', convert(body({
        uploadDir: path.join(__dirname, '/../uploads'),
        keepExtensions: true
    })), async(ctx, next) => {
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
                            uploadType = '.jpeg'
                            break
                        case 'image/gif':
                            uploadType = '.gif'
                            break
                        case 'image/bmp':
                            uploadType = '.bmp'
                            break
                        case 'text/plain':
                            uploadType = '.txt'
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
                    try {
                        return new Promise((resolve, reject) => {
                            let key = ''
                            const isUserDefineSetting = ctx.session.user.settings.filter(item => {
                                return item.stname === 'define'
                            })[0]
                            const isUserDefine = isUserDefineSetting ? isUserDefineSetting.value : false
                            const pathNameSetting = ctx.session.user.settings.filter(item => {
                                return item.stname === 'path'
                            })[0]
                            let pathName = pathNameSetting ? pathNameSetting.value : ''
                            if(pathName){
                                let pathArray = pathName.split('')
                                if(pathArray[0] === '/'){
                                    pathArray.splice(0, 1)
                                }
                                if(pathArray[pathArray.length - 1] && pathArray[pathArray.length - 1] !== '/'){
                                    pathArray.splice(pathArray.length, 0, '/')
                                }
                                pathName = pathArray.join('')
                            }
                            if(isUserDefine){
                                if(pathName){
                                    key = pathName + ctx.request.files[i].name
                                }else{
                                    key = ctx.request.files[i].name
                                }
                            }else{
                                key = (new Date()).getTime() + uploadType
                            }
                            client.uploadFile(compressUrl, { key }, function(err, result) {
                                if (err) {
                                    return reject(err)
                                } else {
                                    // save history
                                    (async function() {
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
                                        } else if (isOk == 0) {
                                            ctx.throw(500, '更新History之后更新User.history失败')
                                        } else if (isOk == -1) {
                                            ctx.throw(500, '更新History失败')
                                        }
                                        resolve()
                                    })()
                                }
                            })
                        })
                    } catch (exception) {
                        console.log(exception)
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
                            uploadType = '.jpeg'
                            break
                        case 'image/gif':
                            uploadType = '.gif'
                            break
                        case 'image/bmp':
                            uploadType = '.bmp'
                            break
                        case 'text/plain':
                            uploadType = '.txt'
                            break
                        default:
                            // 取最后一项
                            let reg = /\.\w+$/i
                            let result = ctx.request.files[i].type.match(reg)
                            if(result){
                                uploadType = ctx.request.files[i].type.match(reg)[0]
                            }
                            break
                    }
                    try {
                        return new Promise((resolve, reject) => {
                            let key = ''
                            const isUserDefineSetting = ctx.session.user.settings.filter(item => {
                                return item.stname === 'define'
                            })[0]
                            const isUserDefine = isUserDefineSetting ? isUserDefineSetting.value : false
                            const pathNameSetting = ctx.session.user.settings.filter(item => {
                                return item.stname === 'path'
                            })[0]
                            let pathName = pathNameSetting ? pathNameSetting.value : ''
                            if(pathName){
                                let pathArray = pathName.split('')
                                if(pathArray[0] === '/'){
                                    pathArray.splice(0, 1)
                                }
                                if(pathArray[pathArray.length - 1] && pathArray[pathArray.length - 1] !== '/'){
                                    pathArray.splice(pathArray.length, 0, '/')
                                }
                                pathName = pathArray.join('')
                            }
                            if(isUserDefine){
                                if(pathName){
                                    key = pathName + ctx.request.files[i].name
                                }else{
                                    key = ctx.request.files[i].name
                                }
                            }else{
                                key = (new Date()).getTime() + uploadType
                            }
                            console.log(key)
                            client.uploadFile(ctx.request.files[i].path, { key }, function(err, result) {
                                if (err) {
                                    console.log(err)
                                    return reject(err)
                                } else {
                                    // save history
                                    (async function() {
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
                    } catch (exception) {
                        console.log(exception)
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
                        uploadType = '.jpeg'
                        break
                    case 'image/gif':
                        uploadType = '.gif'
                        break
                    case 'image/bmp':
                        uploadType = '.bmp'
                        break
                    case 'text/plain':
                        uploadType = '.txt'
                        break
                    default:
                        // 取最后一项
                        let reg = /\.\w+$/i
                        let result = ctx.request.files[i].type.match(reg)
                        if(result){
                            uploadType = ctx.request.files[i].type.match(reg)[0]
                        }
                        break
                }
                try {
                    return new Promise((resolve, reject) => {
                        let key = ''
                        const isUserDefineSetting = ctx.session.user.settings.filter(item => {
                            return item.stname === 'define'
                        })[0]
                        const isUserDefine = isUserDefineSetting ? isUserDefineSetting.value : false
                        const pathNameSetting = ctx.session.user.settings.filter(item => {
                            return item.stname === 'path'
                        })[0]
                        let pathName = pathNameSetting ? pathNameSetting.value : ''
                        if(pathName){
                            let pathArray = pathName.split('')
                            if(pathArray[0] === '/'){
                                pathArray.splice(0, 1)
                            }
                            if(pathArray[pathArray.length - 1] && pathArray[pathArray.length - 1] !== '/'){
                                pathArray.splice(pathArray.length, 0, '/')
                            }
                            pathName = pathArray.join('')
                        }
                        if(isUserDefine){
                            if(pathName){
                                key = pathName + ctx.request.files[i].name
                            }else{
                                key = ctx.request.files[i].name
                            }
                        }else{
                            key = (new Date()).getTime() + uploadType
                        }
                        client.uploadFile(ctx.request.files[i].path, { key }, function(err, result) {
                            if (err) {
                                return reject(err)
                            } else {
                                // save history
                                (async function() {
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
                } catch (exception) {
                    console.log(exception)
                }
            }
        }
    })
}
