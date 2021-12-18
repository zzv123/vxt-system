const jwt = require('jsonwebtoken');
// 秘钥
const secret = 'zheshiyigemiyao';

// 生成token
function generateToken(playload) {
    playload.ctime = Date.now();
    playload.exps = 1000 * 60 * 60 * 24 // 手动设置过期时间 24小时
    return jwt.sign(playload, secret);
}

//验证token
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, data) => {
            if (!token) {
                reject({code: 403, successful: false, msg: '非法请求', data: {}})
                return
            }
            if (err) {
                reject({code: 403, successful: false, msg: 'userToken验证失败', data: {}})
                return
            }
            const beforeTime = data.ctime + data.exps;
            const nowTime = Date.now()
            if (nowTime > beforeTime) {
                // 比对当前时间戳  jwt创建的时间+有效期  前端收到重新获取token
                reject({code: 403, successful: false, msg: 'userToken已过期', data: {}})
                return
            }
            resolve(data)
        })
    })
}

module.exports = {generateToken, verifyToken}