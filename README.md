### 安装
`bower install`之后需要修改`jade-bootstrp`下的`_bootstrap.jade`将原本请求`google api`的`jquery`和`bootstrap`地址替换成本地目录的`bower_components`下的`jquery`和`bootstrap`地址
代码如下：
```jade
doctype html
html(lang="en")
	head
		meta(charset="UTF-8")
		meta(http-equiv="X-UA-Compatible", content="IE=edge")
		meta(name="viewport",content="width=device-width, initial-scale=1")
		meta(name="description",content="")
		meta(name="author",content="")
		link(rel="icon",href="../../favicon.ico")
		title= title
		block styles
			link(rel="stylesheet",href="/bootstrap/dist/css/bootstrap.min.css")
	body(data-spy="scroll",data-target=".scrollspy")
		block body
			
		block scripts
			script(src="/jquery/dist/jquery.min.js")
			script(src="/bootstrap/dist/js/bootstrap.min.js")
```

### 下载安装思源体
https://github.com/adobe-fonts/source-han-sans/blob/master/README-CN.md