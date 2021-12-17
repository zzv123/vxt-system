const express = require("express");

let router = express.Router();

/**
 * @api {get} /api/client/course/course_category 前台获取课程分类
 * @apiName 前台获取课程分类
 * @apiGroup Course
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
router.get("/course_category",(req,res)=> {
    res.utils.execSQLAutoResponse(`
        SELECT
            id,
            title
        FROM
            t_course_category
        WHERE
            parent_id = 0;
    `,"获取成功")
})

/**
 * @api {get} /api/client/course/course_list 前台获取课程列表
 * @apiName 前台获取课程列表
 * @apiGroup Course
 *
 * @apiParam {Number} page_num 页码
 * @apiParam {Number} page_size 条数
 * @apiParam {Number} category_id 课程分类id
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
router.get("/course_list",(req,res)=> {
    const {page_num = 1, page_size = 10, category_id = "-1"} = req.query;
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
            ${"" + category_id === "-1" ? "" : "HAVING category_id=" + category_id}
        LIMIT ${(page_num - 1) * page_size}, ${page_size};
    `)
})

/**
 * @api {get} /api/client/course/course_basic 前台获取课程基本信息
 * @apiName 前台获取课程基本信息
 * @apiGroup Course
 *
 * @apiParam {Number} id 课程id
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
router.get("/course_basic/:id",(req,res)=>{
    const {id} = req.params
    res.utils.execSQLAutoResponse(`
        SELECT
            t_course.id,
            title,
            fm_url,
            is_hot,
            t_course.intro,
            teacher_id,
            name,
            header,
            position,
            COUNT( t_comments.id ) AS comment_count,
            IFNULL( AVG( t_comments.score ), 0 ) AS comment_avg_score 
        FROM
            t_course
        LEFT JOIN t_comments ON t_comments.course_id = t_course.id
        LEFT JOIN t_teacher ON t_course.teacher_id = t_teacher.id 
        GROUP BY
            t_course.id
        HAVING
            id = ${id};
    `,"查询成功")
})

/**
 * @api {get} /api/client/course/course_outline 前台获取课程大纲
 * @apiName 前台获取课程大纲
 * @apiGroup Course
 *
 * @apiParam {Number} id 课程id
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
router.get("/course_outline/:id",(req, res) => {
    const {id} = req.params;
    res.utils.execSQLAutoResponse(`
        SELECT
            id,
            num,
            title,
            video_url
        FROM
            t_course_outline
        WHERE
            course_id = ${id}
        ORDER BY
            num;
    `,"获取成功")
})

/**
 * @api {get} /api/client/course/course_comment 前台获取课程评论
 * @apiName 前台获取课程评论
 * @apiGroup Course
 *
 * @apiParam {Number} id 课程id
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
router.get("/course_comment/:id",(req, res) => {
    const {id} = req.params;
    res.utils.execSQLAutoResponse(`
        SELECT
            tc.id,
            score,
            content,
            create_time,
            nick_name,
            header
        FROM
            t_comments AS tc
            INNER JOIN t_user AS tu ON tc.user_id = tu.id
        WHERE
            course_id = ${id}
        ORDER BY
            create_time DESC;
    `,"获取成功")
})


module.exports = router;
