const express = require("express");
const {decode} = require("html-entities");
let router = express.Router();

/**
 * @api {get} /api/client/search/search_course 前台搜索课程
 * @apiName 前台搜索课程
 * @apiGroup Search
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
router.get("/search_course",(req,res)=> {
    let {key = ""} = req.query;
    key = decode(key);
    res.utils.execSQLAutoResponse(`
        SELECT
            t_course.id,
            category_id,
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
        HAVING title LIKE '%${key}%';
    `,"获取成功")
})

/**
 * @api {get} /api/client/search/search_teacher 前台搜索讲师
 * @apiName 前台搜索讲师
 * @apiGroup Search
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
router.get("/search_teacher",(req,res)=> {
    let {key = ""} = req.query;
    key = decode(key);
    res.utils.execSQLAutoResponse(`
        SELECT
            t_teacher.id,
            header,
            position,
            name,
            is_star,
            COUNT( t_course.id ) AS course_count,
            t_teacher.intro
        FROM
            t_teacher
        LEFT JOIN
            t_course
        ON
            t_teacher.id = t_course.teacher_id
        GROUP BY 
            t_teacher.id
        HAVING name LIKE '%${key}%';
    `,"获取成功")
})

/**
 * @api {get} /api/client/search/search_article 前台搜索文章
 * @apiName 前台搜索文章
 * @apiGroup Search
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
router.get("/search_article",(req,res)=> {
    let {key = ""} = req.query;
    key = decode(key);
    res.utils.execSQLAutoResponse(`
        SELECT
            id,
            title,
            intro,
            create_time
        FROM
            t_news
        WHERE
            title LIKE '%${key}%'
        ORDER BY
            create_time DESC
    `,"获取成功")
})

/**
 * @api {get} /api/client/search/search_all 前台搜索全部
 * @apiName 前台搜索全部
 * @apiGroup Search
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
router.get("/search_all",(req,res)=> {
    let {key} = req.query;
    key = decode(key);
    Promise.all([res.utils.execSQL(`
        SELECT
            t_course.id,
            category_id,
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
        HAVING title LIKE '%${key}%';
    `),res.utils.execSQL(`
        SELECT
            t_teacher.id,
            header,
            position,
            name,
            is_star,
            COUNT( t_course.id ) AS course_count,
            t_teacher.intro
        FROM
            t_teacher
        LEFT JOIN
            t_course
        ON
            t_teacher.id = t_course.teacher_id
        GROUP BY 
            t_teacher.id
        HAVING name LIKE '%${key}%';
    `),res.utils.execSQL(`
        SELECT
            id,
            title,
            intro,
            create_time
        FROM
            t_news
        WHERE
            title LIKE '%${key}%'
        ORDER BY
            create_time DESC;
    `)]).then(([courseResult, teacherResult, articleResult]) => {
        res.send(res.utils.ResponseTemp(200,true,"获取成功",{
            courseResult,
            teacherResult,
            articleResult
        }))
    })
})




module.exports = router;
