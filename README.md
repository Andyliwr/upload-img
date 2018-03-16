## **小迪版图片上传工具**
[Demo地址](http://upload.andylistudio.com)
### **小迪图片上传工具特色**
1. **拖拽上传**
<br>将本地图片拖放到白框中就能实现图片自动上传，也可以选择手动打开文件上传，两种方式任君选择。

2. **图片压缩**
<br>在"个人中心"设置"上传自动压缩"，即可实现上传过程中对图片压缩，这样生成的图片链接加载更快哦~

3. **图片格式化**
<br>上传完成后的图片可以通过url传参，设置图片宽高，裁剪图片，以及添加图片水印等等..

### **部署文档**
安装两个服务
```
sudo apt-get install mongodb
sudo apt-get install redis
# 看看两个服务是否正常启动
sudo netstat -tunpl
```
克隆项目并安装依赖
```
git clone https://github.com/Andyliwr/ldk-upload-img.git
cd ldk-upload-img
npm install
# 安装其他静态资源依赖
npm install bower -g
bower install
```
修改配置文件，将`config/index.js`中的`accessKey`和`secretKey`替换成自己七牛云的秘钥，然后启动项目
```
npm run prd
```
最后访问[`http://localhost:5000`](http://localhost:5000)就能上传您的图片了!

### **截图**
#### **首页**
<img src="https://fs.andylistudio.com/1521210473840.jpg/default" />

#### **拖拽上传**
<img src="https://fs.andylistudio.com/1521210471220.jpg/default" />

#### **注册**
<img src="https://fs.andylistudio.com/1521210480561.jpg/default" />

#### **上传记录**
<img src="https://fs.andylistudio.com/1521210477738.jpg/default" />





