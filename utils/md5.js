const crypto = require('crypto')

const md5 = str => {
    return crypto.createHash('md5').update(str).digest('hex')
}

module.exports = md5
