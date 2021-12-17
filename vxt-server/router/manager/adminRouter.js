let express = require('express');
let router = express.Router();

/**
 * @api {post} /api/manager/admin/admin_login 后台管理员登录
 * @apiName 后台管理员登录
 * @apiGroup Admin
 *
 * @apiParam {String} account 账号
 * @apiParam {String} password 密码
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "登录成功",
 *       "data": "data"
 *     }
 */
router.post("/admin_login", (req, res) => {
    console.log(req.body)
    const {account, password} = req.body
    if (account.length === 0 || password.length === 0) {
        res.send(res.utils.ResponseTemp(400, false, "请输入账号密码", {}))
        return null
    }
    let sql = "SELECT id, account, nick_name FROM t_admin WHERE account=? AND password=?"
    res.utils.execSQL(sql, [account, password]).then((result) => {
        if (result.length > 0) {
            res.send(res.utils.ResponseTemp(200, true, "登录成功", result[0]));
        } else {
            res.send(res.utils.ResponseTemp(400, false, "登录失败", {}));
        }
    })
})

/**
 * @api {post} /api/manager/admin/admin_register 后台管理员注册
 * @apiName 后台管理员注册
 * @apiGroup Admin
 *
 * @apiParam {String} account 账号
 * @apiParam {String} password 密码
 * @apiParam {String} nick_name 昵称
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "注册成功",
 *       "data": "data"
 *     }
 */
router.post("/admin_register", (req, res) => {
    const {account, password, nick_name} = req.body
    if (account.length === 0 || password.length === 0) {
        res.send(res.utils.ResponseTemp(400, false, "请传递account账号, password密码", {}))
        return null
    }
    // 查询是否有重复账号
    res.utils.execSQL(`SELECT * FROM t_admin WHERE account = ?;`, [account], result => {
        if (result.length > 0) {
            res.send(res.utils.ResponseTemp(400, false, "账号已经存在, 请重新输入", {}))
            return null
        } else {
            res.utils.execSQL(`INSERT INTO t_admin (account, password, nick_name) VALUES (?, ?, ?)`, [account, password, nick_name], (result) => {
                if (result.affectedRows === 1) {
                    res.send(res.utils.ResponseTemp(200, true, "注册成功", {
                        id: result.insertId,
                        account: account,
                        nick_name: nick_name
                    }))
                }
            })
        }
    })
})

module.exports = router;
