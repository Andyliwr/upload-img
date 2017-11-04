const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')
const imageminGifsicle = require('imagemin-gifsicle')
const path = require('path')

function imageMinify(url) {
    return imagemin([url], path.join(__dirname + '/../uploads/compressed/'), {
        plugins: [
            imageminJpegtran(),
            imageminPngquant({ quality: '40-50' }),
            imageminGifsicle()

        ]
    })
}

module.exports = imageMinify