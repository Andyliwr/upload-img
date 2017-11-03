/**
 * FileName:fileUtils.js
 *
 * Author:wangyan
 * Date:2013-10-26 21:38
 * Version:V1.0.0.0
 * Email:yywang1991@gmail.com
 * Describe:
 *        文件工具类
 * Change Record:
 * {        date    name    describe}
 *
 */
const promise = require('promise');
const path = require('path')
function mkDir() {
    var path = getFileDir();
    var ndir = require('ndir');
    var mkdir = promise.denodeify(ndir.mkdir);
    return mkdir(path).then(function (err) {
        if (err) {
            throw err;
        }
        return path;
    });

}

function getFileDir() {
    var basePath = __dirname + '/../logs/file/'
    var day = new Date()
    var dayStr = day.getFullYear() + '-' + day.getMonth() + '-' + day.getDate()
    return path.join(basePath + dayStr + '/' + day.getTime() + '/')
}

exports.mkDir = mkDir;
