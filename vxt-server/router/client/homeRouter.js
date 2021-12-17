const express = require("express");

let router = express.Router();

/**
 * @api {get} /api/client/home/web_config 前台获取配置信息
 * @apiName 前台获取配置信息
 * @apiGroup Home
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
router.get("/web_config",(req,res)=>{
    res.utils.execSQLAutoResponse(`
        SELECT 
            wechat_qrcode, 
            mini_program, 
            wb_qrcode, 
            app, 
            tel 
        FROM 
            t_config 
        LIMIT 1;
    `, '获取成功', function (result) {
        if (result.length > 0) {
            return result[0];
        } else {
            return {};
        }
    })
})

/**
 * @api {get} /api/client/home/nav_menu 前台获取导航菜单
 * @apiName 前台获取导航菜单
 * @apiGroup Home
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
router.get("/nav_menu",(req,res)=> {
    res.utils.execSQLAutoResponse(`
        SELECT 
            id, 
            title, 
            route 
        FROM 
            t_nav;
    `, "获取成功")
})

/**
 * @api {get} /api/client/home/focus_img 前台获取焦点图课程信息
 * @apiName 前台获取焦点图课程信息
 * @apiGroup Home
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
router.get("/focus_img",(req,res)=> {
    res.utils.execSQLAutoResponse(`
        SELECT 
            id, 
            title, 
            ad_url, 
            course_id 
        FROM 
            t_ad 
        WHERE 
            is_show = 1;
    `, "获取成功")
})

/**
 * @api {get} /api/client/home/hot_course 前台获取热门好课
 * @apiName 前台获取热门好课
 * @apiGroup Home
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
router.get("/hot_course",(req,res)=> {
    res.utils.execSQLAutoResponse(`
        SELECT
            t_course.id,
            title,
            fm_url,
            is_hot,
        COUNT( t_comments.id ) AS comment_total_count,
        AVG( IFNULL(t_comments.score, 0)) AS comment_avg_score 
        FROM
            t_course
        LEFT JOIN t_comments ON t_course.id = t_comments.course_id 
        GROUP BY
            t_course.id 
        HAVING
            is_hot = 1
        LIMIT 10;
    `, "获取成功")
})

/**
 * @api {get} /api/client/home/hot_course 前台获取明星讲师
 * @apiName 前台获取明星讲师
 * @apiGroup Home
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
router.get("/star_teacher",(req,res)=> {
    res.utils.execSQLAutoResponse(`
        SELECT 
            id, 
            name, 
            header, 
            position,
            intro 
        FROM 
            t_teacher 
        WHERE 
            is_star = 1
        LIMIT 6;
    `, "获取成功")
})

/**
 * @api {get} /api/client/home/last_news 前台获取最新文章
 * @apiName 前台获取最新文章
 * @apiGroup Home
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
router.get("/last_news",(req,res)=> {
    res.utils.execSQLAutoResponse(`
        SELECT 
            id, 
            title,
            create_time
        FROM 
            t_news 
        ORDER BY
            create_time
        DESC
        LIMIT 10;
    `, "获取成功")
})

module.exports = router;
