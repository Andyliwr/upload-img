const convert = require('koa-convert')
const body = require('koa-better-body')
const path = require('path')
const qn = require('qn')
const tinify = require("tinify") // image compress
const eventproxy = require('eventproxy')
const uuid = require('uuid')
const config = require('../config')

// tinypng上传设置
tinify.key = "Q0Q_7x6ppzaVY00KSOu1vc5-FVKyN20J"

// qiniu上传设置
var client = qn.create({
    accessKey: config.accessKey,
    secretKey: config.secretKey,
    bucket: 'upload',
    origin: 'http://oyh0gj8ht.bkt.clouddn.com',
});

// image compress
function imageComparess(url, saveName, callback) {
    var urlReg = new RegExp('[a-zA-z]+://[^\s]*', '')
    if (urlReg.test(url)) {
        if (typeof callback === "function") {
            tinify.fromUrl(url).toFile(saveName, callback)
        } else {
            tinify.fromUrl(url).toFile(saveName)
        }
    } else {
        console.log('It is not a url')
        if (typeof callback === "function") {
            console.log(url + ' ' + saveName)
            tinify.fromFile(url).toFile(saveName, callback)
        } else {
            tinify.fromFile(url).toFile(saveName)
        }
    }
}

// comparess and upload
function compressAndUpload(url, type, tmpPath, saveName, success, fail) {
    var ep = new eventproxy()
    ep.all('hasFinishedCompress', function(data) {
        // start to upload
        console.log('完成压缩' + data)
        if (typeof success !== 'function' && typeof fail !== 'function') {
            var success = function(ret) {
                console.log(url + '  ===>  ' + 'https://olpkwt43d.qnssl.com/' + ret.key)
            };
            var fail = function(err) {
                console.log(url + '压缩失败....')
                console.log(err)
            };
        }
        uploadFileToQiNiu(tmpPath + data, 'myapp/' + (type ? (type + '/') : '') + 'c_' + data, success, fail)
    });
    imageComparess(url, tmpPath + saveName, function() {
        ep.emit('hasFinishedCompress', saveName)
    })
}

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
                    let compressUrl = await compress(ctx.request.files[i].path)
                    await upload(compressUrl)
                }
            } else {
                for (let i = 0; i < ctx.request.files.length; i++) {
                    await upload(ctx.request.files[i].path)
                }
            }
        } else {
            for (let i = 0; i < ctx.request.files.length; i++) {
                let uploadType = ''
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
                        client.uploadFile(ctx.request.files[i].path, { key: (new Date()).getTime() + uploadType }, function(err, result) {
                            console.log(err, result)
                            if (err) {
                                ctx.throw(500, '图片上传失败')
                                return reject(err)
                            } else {
                                ctx.body = {
                                    ok: true,
                                    msg: '图片上传成功',
                                    data: result
                                }
                                resolve()
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