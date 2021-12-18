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
 * @api {get} /api/manager/statistics/category_course_count 后台获取分类课程统计
 * @apiName 后台获取分类课程统计
 * @apiGroup Statistics
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "查询分类课程统计成功",
 *       "data": "data"
 *     }
 */
router.get("/category_course_count", (req, res) => {
    res.utils.execSQLAutoResponse(`
        SELECT
        tcc.id AS category_id,
        tcc.title AS category_name,
        count( tc.id ) AS course_count 
        FROM
        t_course_category AS tcc
        LEFT JOIN t_course AS tc ON tc.category_id = tcc.id 
        GROUP BY
        tcc.id;
    `, "查询分类课程统计成功")
})

/**
 * @api {get} /api/manager/statistics/user_week_count 后台获取最近一周的用户增长统计
 * @apiName 后台获取最近一周的用户增长统计
 * @apiGroup Statistics
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "查询最近一周的用户增长统计成功",
 *       "data": "data"
 *     }
 */
router.get("/user_week_count", (req, res) => {
    res.utils.execSQLAutoResponse(`
        SELECT
        register_time,
        count(*) AS register_count 
        FROM
        t_user 
        WHERE
        date_sub( curdate(), INTERVAL 7 DAY ) < date( register_time ) 
        GROUP BY
        TO_DAYS( register_time ) 
        ORDER BY
        register_time;
    `, "查询最近一周的用户增长统计成功")
})

/**
 * @api {get} /api/manager/statistics/comment_score_count 后台获取评价分布统计
 * @apiName 后台获取评价分布统计
 * @apiGroup Statistics
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "查询评价分布统计成功",
 *       "data": "data"
 *     }
 */
router.get("/comment_score_count", (req, res) => {
    res.utils.execSQLAutoResponse(`
        SELECT
        score,
        count(*) AS score_count 
        FROM
        t_comments 
        GROUP BY
        score;
    `, "查询评价分布统计成功")
})


module.exports = router;
