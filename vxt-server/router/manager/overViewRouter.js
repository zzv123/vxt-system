const express = require('express');
const router = express.Router();
const {verifyToken} = require("../../utils/jwt.js");

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
 * @api {get} /api/manager/over_view/ov_user 后台获取用户统计
 * @apiName 后台获取用户统计
 * @apiGroup OverView
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "获取用户统计成功",
 *       "data": "data"
 *     }
 */
router.get("/ov_user", (req, res) => {
    let data = {
        today: 0,
        total: 0
    }
    res.utils.execSQL("select count(*) as today from t_user where to_days(register_time) = to_days(now());", [], result => {
        data.today = result[0].today
        res.utils.execSQL("select count(*) as total from t_user;", [], result => {
            data.total = result[0].total
            res.json(res.utils.ResponseTemp(200,true,"获取用户统计成功", data))
        })
    })
})

/**
 * @api {get} /api/manager/over_view/ov_teacher 后台获取讲师统计
 * @apiName 后台获取讲师统计
 * @apiGroup OverView
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "获取讲师统计成功",
 *       "data": "data"
 *     }
 */
router.get("/ov_teacher", (req, res) => {
    let data = {
        total: 0
    }
    res.utils.execSQL("select count(*) as total from t_teacher;", [], result => {
        data.total = result[0].total
        res.json(res.utils.ResponseTemp(200,true,"获取讲师统计成功", data))
    })
})

/**
 * @api {get} /api/manager/over_view/ov_course 后台获取课程统计
 * @apiName 后台获取课程统计
 * @apiGroup OverView
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "获取课程统计成功",
 *       "data": "data"
 *     }
 */
router.get("/ov_course", (req, res) => {
    let data = {
        total: 0
    }
    res.utils.execSQL("select count(*) as total from t_course;", [], result => {
        data.total = result[0].total
        res.json(res.utils.ResponseTemp(200,true,"获取课程统计成功", data))
    })
})

/**
 * @api {get} /api/manager/over_view/ov_article 后台获取文章统计
 * @apiName 后台获取文章统计
 * @apiGroup OverView
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "获取文章统计成功",
 *       "data": "data"
 *     }
 */
router.get("/ov_article", (req, res) => {
    let data = {
        total: 0
    }
    res.utils.execSQL("select count(*) as total from t_news;", [],result => {
        data.total = result[0].total
        res.json(res.utils.ResponseTemp(200,true,"获取文章统计成功", data))
    })
})

/**
 * @api {get} /api/manager/over_view/ov_comment 后台获取评论统计
 * @apiName 后台获取评论统计
 * @apiGroup OverView
 *
 * @apiParam {Number} score 评论等级
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "获取评论列表成功",
 *       "data": "data"
 *     }
 */
router.get("/ov_comment", (req, res) => {
    let score = req.query.score || 0
    let sql = `
        SELECT
        tc.id AS comment_id,
        tc.score AS comment_score,
        tc.content AS comment_content,
        tc.create_time AS comment_time,
        tc.user_id AS user_id,
        tc.course_id AS course_id,
        tu.header AS user_header,
        tu.nick_name AS user_name 
        FROM
        t_comments AS tc
        LEFT JOIN t_user AS tu ON tc.user_id = tu.id 
        WHERE
        tc.score = ?
        ORDER BY
        create_time DESC
    `;
    res.utils.execSQLTEMPAutoResponse(sql, [score], "获取评论列表成功")
})

module.exports = router;
