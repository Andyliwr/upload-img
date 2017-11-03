const config = {
	port: 3000,
	mongo_url: 'mongodb://localhost:27017/ldk-upload-img',
	accessKey: 'pz1XaE-7IPSWuJjLTrjH3Rv9O5v0hj510O1ttMm6', //七牛账号的key值，https://portal.qiniu.com/user/key
	secretKey: 'HB_zxxzxJ3YpKFAD3PC7egJvgx4yOp3t6Fg7xdYP',
	bucket: 'upload', //空间名称
	isUseHttps: true, //配置使用https，并且对应到正确的区域，详情请查考https://github.com/gpake/qiniu-wxapp-sdk/blob/master/README.md
}


module.exports = config;
