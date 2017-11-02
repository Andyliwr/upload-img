### 安装
`bower install`之后需要修改`jade-bootstrp`下的`_bootstrap.jade`将原本请求`google api`的`jquery`和`bootstrap`地址替换成本地目录的`bower_components`下的`jquery`和`bootstrap`地址。（注意这里引用的`bootstrap.min.css`使用`bootswatch`的	`paper`主题）

代码如下：
```jade
doctype html
html(lang="zh-cn")
	head
		meta(charset="UTF-8")
		meta(http-equiv="X-UA-Compatible", content="IE=edge")
		meta(name="viewport",content="width=device-width, initial-scale=1")
		meta(name="description",content="")
		meta(name="author",content="")
		link(rel="icon",href="../../favicon.ico")
		title= title
		block styles
			link(rel="stylesheet",href="/styles/bootstrap.min.css")
	body(data-spy="scroll",data-target=".scrollspy")
		block body
			
		block scripts
			script(src="/jquery/dist/jquery.min.js")
			script(src="/bootstrap/dist/js/bootstrap.min.js")
```

### 下载安装思源体
```
@font-face {font-family: 'webfont';
  src: url('//at.alicdn.com/t/webfont_x4rf8lst8s62yb9.eot'); /* IE9*/
  src: url('//at.alicdn.com/t/webfont_x4rf8lst8s62yb9.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('//at.alicdn.com/t/webfont_x4rf8lst8s62yb9.woff') format('woff'), /* chrome、firefox */
  url('//at.alicdn.com/t/webfont_x4rf8lst8s62yb9.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('//at.alicdn.com/t/webfont_x4rf8lst8s62yb9.svg#NotoSansHans-DemiLight') format('svg'); /* iOS 4.1- */
}
```

### 编写时注意点
jade因为不支持同时在一个文件中使用`tab`和空格缩进，所以建议在使用`sublime`开发的时候将右下角的`using space`打上勾，这样`sublime`就会默认将`tab`替换成空格

## 小迪图片上传工具特色
1. 拖拽上传
将本地图片拖放到白框中就能实现图片自动上传，也可以选择手动打开文件上传，两种方式任君选择。

2. 图片压缩
在"个人中心"设置"上传自动压缩"，即可实现上传过程中对图片压缩，这样生成的图片链接加载更快哦~

3. 图片格式化
上传完成后的图片可以通过url传参，设置图片宽高，裁剪图片，以及添加图片水印等等..

### 模型
#### user
(username, password, avatar, email, history, settings)
https://www.npmjs.com/package/koa-session2
redis 可视化工具 https://github.com/luin/medis
图片拖拽上传 https://github.com/wangyan9110/FileUploader/blob/master/views/file.ejs


### 部署文档
1. mongo
2. redis