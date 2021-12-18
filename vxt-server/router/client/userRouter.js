const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {generateToken, verifyToken} = require("../../utils/jwt.js");
let router = express.Router();

/**
 * @api {post} /api/client/user/user_register 前台用户注册
 * @apiName 前台用户注册
 * @apiGroup User
 *
 * @apiParam {String} account 账号
 * @apiParam {String} password 密码
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
router.post("/user_register", (req, res) => {
    const {account, password} = req.body;
    // 1.账号重名检测
    res.utils.execSQL(`
        SELECT
            id
        FROM
            t_user
        WHERE
            account = ?;
    `, [account]).then(result => {
        if (result.length > 0) {
            res.send(res.utils.ResponseTemp(400, false, "用户名已存在，请修改！", {}))
        } else {
            let nick_name = "小撩-匿名";
            let header = "/images/user/xl.jpg";
            let intro = "喜欢IT，就来撩课！";
            res.utils.execSQLTEMPAutoResponse(`
                INSERT INTO
                    t_user (account, password, nick_name, header, intro)
                VALUES
                    (?, ?, ?, ?, ?);
            `, [account, password, nick_name, header, intro], "注册成功", result => {
                if (result.affectedRows > 0) {
                    return {
                        id: result.insertId,
                        account,
                        nick_name,
                        header,
                        intro
                    }
                }
            })
        }
    })
})

/**
 * @api {post} /api/client/user/user_login 前台用户登录
 * @apiName 前台用户登录
 * @apiGroup User
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
router.post("/user_login", (req, res) => {
    const {account, password} = req.body;
    res.utils.execSQLTEMPAutoResponse(`
        SELECT
            id,
            account,
            nick_name,
            header,
            intro
        FROM
            t_user
        WHERE
            account = ?
        AND
            password = ?
    `, [account, password], "登录成功", result => {
        if (result.length > 0) {
            let token = generateToken({
                login: true,
                name: account,
                time: Date.now()
            })
            result[0].token = token
            return result[0]
        } else {
            res.send(res.utils.ResponseTemp(400, false, "用户名或密码错误", {}));
        }
    })
})

// 对后面的接口进行鉴权
 router.use((req, res, next) => {
     const {token} = req.headers
     verifyToken(token)
         .then(() => {
             next()
         }).catch((err) => {
         res.send(err)
     })
 })


/**
 * @api {get} /api/client/user/study_history 前台获取学习历史记录
 * @apiName 前台获取学习历史记录
 * @apiGroup User
 *
 * @apiParam {Number} user_id 用户id
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "获取成功",
 *       "data": "data"
 *     }
 */
router.get("/study_history", (req, res) => {
    let {user_id} = req.query;
    if (!user_id) {
        res.send(res.utils.ResponseTemp(400, false, "请传入用户ID", {}))
        return;
    }
    res.utils.execSQLTEMPAutoResponse(`
        SELECT
            t_study_course.*,
            count( t_course_outline.id ) AS course_outline_count 
        FROM
            (
            SELECT
                t_study_history.user_id,
                t_study_history.id,
                t_study_history.course_id,
                t_course.title AS course_title,
                t_course.fm_url AS course_fm_url,
                t_course.is_hot AS course_is_hot,
                count( t_study_history.outline_id ) AS learned_count 
            FROM
                t_study_history
                LEFT JOIN t_course ON t_study_history.course_id = t_course.id 
            WHERE
                user_id = ${user_id} 
            GROUP BY
                course_id 
            ) AS t_study_course
            LEFT JOIN t_course_outline ON t_course_outline.course_id = t_study_course.course_id 
        GROUP BY
            t_course_outline.course_id;
    `, "获取成功")
})

/**
 * @api {post} /api/client/user/update_study_history 前台学习历史记录新增/更新
 * @apiName 前台学习历史记录新增/更新
 * @apiGroup User
 *
 * @apiParam {Number} user_id 用户id
 * @apiParam {Number} course_id 课程id
 * @apiParam {Number} outline_id 大纲id
 * @apiParam {Number} is_finish 是否已学完：1，已学完该课时，0，未学完该课时
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "获取成功",
 *       "data": "data"
 *     }
 */
router.post("/update_study_history", (req, res) => {
    // is_finish: 1 代表已经学完了该课时，否则，就是正在学习
    const {user_id, course_id, outline_id, is_finish = "0"} = req.body;
    res.utils.execSQL(`
        SELECT COUNT (*) AS 
            is_learned 
        FROM 
            t_study_history 
        WHERE 
            user_id = ? 
        AND
            outline_id = ?;     
    `, [user_id, outline_id]).then(result => {
        console.log(result);
        let is_learned = result[0].is_learned;
        if (is_learned) {
            // 更新
            res.utils.execSQLTEMPAutoResponse(`
                UPDATE
                    t_study_history
                SET 
                    state = ?
                WHERE
                    user_id = ?
                AND
                    outline_id = ?; 
            `, ["" + is_finish === "0" ? 1 : 2, user_id, outline_id], "更新成功", result => ({}))
        } else {
            // 新增
            res.utils.execSQLTEMPAutoResponse(`
                INSERT INTO
                    t_study_history (user_id, course_id, outline_id, state)
                VALUES
                    (?, ?, ?, ?);
            `, [user_id, course_id, outline_id, "" + is_finish === "0" ? 1 : 2, user_id, outline_id], "插入成功", result => ({}))
        }
    })
})

/**
 * @api {post} /api/client/user/update_header 前台用户头像上传
 * @apiName 前台用户头像上传
 * @apiGroup User
 *
 * @apiParam {Number} user_id 用户id
 * @apiParam {File} header 头像图片
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "更新成功",
 *       "data": "data"
 *     }
 */
let uploader = multer({dest: path.resolve(__dirname, "../../public/images/user")});
router.post("/update_header", uploader.single("header"), (req, res) => {
    let file = req.file;
    let {user_id} = req.body;
    let extName = path.extname(file.originalname);
    fs.renameSync(file.path, path.resolve(__dirname, "../../public/images/user/", file.filename + extName));

    // 0.把用户对应的老头像，删除
    res.utils.execSQL(`
        SELECT
            header
        FROM
            t_user
        WHERE
            id = ?;
    `, [user_id]).then(result => {
        if (result.length > 0) {
            let userObj = result[0];
            let userHeaderPath = userObj.header;
            // 不是默认头像
            if (userHeaderPath.toLowerCase() !== "/images/user/xl.jpg") {
                // 删除对应的图片资源
                fs.unlinkSync(path.resolve(__dirname, "../public" + userHeaderPath));
            }
            // 1.把新图片的路径，存储到数据库表当中（更新）
            let newPath = `/images/user/${file.filename + extName}`;
            res.utils.execSQL(`
                UPDATE
                    t_user 
                SET
                    header = ?
                WHERE
                    id = ?;
            `, [newPath, user_id]).then(result => {
                if (result.affectedRows > 0) {
                    // 更新成功
                    res.utils.execSQL(`
                        SELECT
                            id, account, nick_name, header, intro 
                        FROM
                            t_user
                        WHERE
                            id = ?;
            `, [user_id]).then(userResult => {
                        res.send(res.utils.ResponseTemp(200, true, "更新成功", userResult[0]))
                    })
                } else {
                    res.send(res.utils.ResponseTemp(400, false, "更新失败", {}))
                }
            })
        }
    })
})

/**
 * @api {post} /api/client/user/update_info 前台用户基本信息更新
 * @apiName 前台用户基本信息更新
 * @apiGroup User
 *
 * @apiParam {Number} user_id 用户id
 * @apiParam {String} nick_name 用户昵称
 * @apiParam {String} intro 用户简介
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "更新成功",
 *       "data": "data"
 *     }
 */
router.post("/update_info", (req, res) => {
    const {user_id, nick_name, intro} = req.body;
    res.utils.execSQL(`
        UPDATE
            t_user
        SET
            nick_name = ?, intro = ?
        WHERE
            id = ?;
    `, [nick_name, intro, user_id]).then(result => {
        // id不存在
        // id存在，新旧内容不一样
        // id存在，新旧内容一样
        console.log(result);
        if (result.affectedRows > 0) {
            // 更新成功
            res.utils.execSQL(`
                SELECT
                    id, account, nick_name, header, intro 
                FROM
                    t_user
                WHERE
                    id = ?;
            `, [user_id]).then(userResult => {
                res.send(res.utils.ResponseTemp(200, true, "更新成功", userResult[0]))
            })
        } else {
            // 不存在
            res.send(res.utils.ResponseTemp(400, false, "更新失败：用户不存在", {}))
        }
    })
})

/**
 * @api {post} /api/client/user/update_password 前台用户修改密码
 * @apiName 前台用户修改密码
 * @apiGroup User
 *
 * @apiParam {String} account 用户账号
 * @apiParam {String} password 用户密码
 * @apiParam {String} new_password 用户新密码
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "更新成功",
 *       "data": "data"
 *     }
 */
router.post("/update_password", (req, res) => {
    const {account, password, new_password} = req.body;
    res.utils.execSQLTEMPAutoResponse(`
        UPDATE
            t_user
        SET
            password = ?
        WHERE
            account = ? AND password = ?;
    `, [new_password, account, password], "更新完成", result => {
        if (result.affectedRows > 0) {
            res.send(res.utils.ResponseTemp(200, true, "更新成功", {}))
        } else {
            res.send(res.utils.ResponseTemp(400, false, "账号或密码错误，更新失败", {}))
        }
    })
})

module.exports = router;
