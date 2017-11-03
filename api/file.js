const convert = require('koa-convert')
const body = require('koa-better-body')
const path = require('path')
const qiniu = require("qiniu");
const tinify = require("tinify"); // image compress
const eventproxy = require('eventproxy');
const uuid = require('uuid');
const config = require('../config')

// tinypng上传设置
tinify.key = "Q0Q_7x6ppzaVY00KSOu1vc5-FVKyN20J";

// qiniu上传设置
const baseUrl = 'http://oyh0gj8ht.bkt.clouddn.com'
const qiniu_config = new qiniu.conf.Config()
/**
 * 华东 qiniu.zone.Zone_z0 upload空间
 * 华南 qiniu.zone.Zone_z2 andyliwr-server空间
 * 具体请参考 https://developer.qiniu.com/kodo/sdk/1289/nodejs
 */
qiniu_config.zone = qiniu.zone.Zone_z0
// 是否使用https域名
qiniu_config.useHttpsDomain = true
// 上传是否使用cdn加速
qiniu_config.useCdnDomain = true
const formUploader = new qiniu.form_up.FormUploader(qiniu_config)
const putExtra = new qiniu.form_up.PutExtra()

// 压缩
async function compress(tmpurl) {
  console.log('压缩', tmpurl)
  return '压缩后的链接:' + tmpurl
}

// 上传
async function upload(tmpurl) {
  console.log('上传', tmpurl)

}


/**
 * @function uptoken 获取上传凭证
 */
function uptoken() {
  //需要填写你的 Access Key 和 Secret Key
  const mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey)
  var options = {
    scope: config.bucket,
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
  }
  let putPolicy = new qiniu.rs.PutPolicy(options)
  return putPolicy.uploadToken(mac)
}


/**
 * @function uploadFileToQiNiu 上传文件的调用方法
 * @param localFileUrl 本地图片的url
 * @param remoteFileName 要上传的图片在远程服务器的名字
 * @param success 上传成功的回调
 * @param fail 上传失败的回调
 * @example uploadFileToQiNiu('./reptile/qn_upload/me_test2.jpg', 'me_test2.jpg', success, fail);
 *
 */
async function uploadFileToQiNiu(localFileUrl, remoteFileName, callback) {
  console.log(callback)
  formUploader.putFile(uptoken(), remoteFileName, localFileUrl, putExtra, callback)
}

// image compress
function imageComparess (url, saveName, callback){
  var urlReg = new RegExp('[a-zA-z]+://[^\s]*', '')
  if(urlReg.test(url)){
    if(typeof callback === "function"){
      tinify.fromUrl(url).toFile(saveName, callback)
    }else{
      tinify.fromUrl(url).toFile(saveName)
    }
  }else{
    console.log('It is not a url')
    if(typeof callback === "function"){
      console.log(url+' '+saveName)
      tinify.fromFile(url).toFile(saveName, callback)
    }else{
      tinify.fromFile(url).toFile(saveName)
    }
  }
}

// comparess and upload
function compressAndUpload(url, type, tmpPath, saveName, success, fail){
  var ep = new eventproxy()
  ep.all('hasFinishedCompress', function(data){
    // start to upload
    console.log('完成压缩'+data)
    if(typeof success !== 'function' && typeof fail !== 'function'){
      var success = function (ret) {
        console.log(url+ '  ===>  ' + 'https://olpkwt43d.qnssl.com/' + ret.key)
      };
      var fail = function (err) {
        console.log(url + '压缩失败....')
        console.log(err)
      };
    }
    uploadFileToQiNiu(tmpPath +data, 'myapp/'+ (type ? (type + '/') : '') + 'c_' + data, success, fail)
  });
  imageComparess(url, tmpPath + saveName, function(){
    ep.emit('hasFinishedCompress', saveName)
  })
}


var success = function (res) {
  console.log('上传成功')
  console.log(JSON.stringify(res))
};
var fail = function (err) {
  console.log('上传失败')
  console.log(err)
};
// uploadFileToQiNiu(path.join(__dirname + '/../public/images/avatar.jpg'), 'avatar/andyliwr20171103.png')
// imageComparess('http://avatar.csdn.net/E/2/7/1_u014374031.jpg', './tmp/1.jpg', function(){
//   console.log('success');
// })
// compressAndUpload('http://avatar.csdn.net/E/2/7/1_u014374031.jpg' ,'avatar', './tmp/', 'andyliwr.jpg', success, fail);

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
        switch(ctx.request.files[i].type){
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
        if(uploadType){
          await uploadFileToQiNiu(ctx.request.files[i].path, (new Date()).getTime() + uploadType, function(respErr,
            respBody, respInfo) {
            if(respErr){
              ctx.body = {ok:false, msg: '图片上传失败', err: {
                status: 500,
                body: respErr
              }}
            }
            if(respInfo.statusCode == 200){
              console.log('caonima2')
              ctx.body = {ok:true, msg: '图片上传成功', data: {
                url: baseUrl + '/' + respBody.key,
                fsize: respBody.key,
                bucket: respBody.bucket
              }}
            }else{
              ctx.body = {ok:false, msg: '图片上传失败', err: {
                status: respInfo.statusCode,
                body: respBody
              }}
            }
          })
          console.log('caonima')
        }else{
          ctx.body = {ok:false, msg: '图片格式不支持'}
        }
      }
    }
  })
}
