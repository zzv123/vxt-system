const express = require("express");

let router = express.Router();

/**
 * @api {get} /api/client/teacher/teacher_list 前台获取讲师列表
 * @apiName 前台获取讲师列表
 * @apiGroup Teacher
 *
 * @apiParam {Number} page_num 页码
 * @apiParam {Number} page_size 条数
 * @apiParam {Number} is_star 查询条件(-1: 全部讲师; 0: 非明星讲师; 1: 明星讲师)
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
router.get("/teacher_list", (req, res) => {
    // is_star = -1 全部讲师 1 明星讲师 0 不是明星讲师
    const {page_num = 1, page_size = 5, is_star = "-1"} = req.query
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
        HAVING is_star IN (${"" + is_star === "-1" ? "0, 1" : is_star})
        LIMIT ${(page_num - 1) * page_size}, ${page_size};
    `, "获取成功")
})

/**
 * @api {get} /api/client/teacher/teacher_detail 前台获取讲师详情
 * @apiName 前台获取讲师详情
 * @apiGroup Teacher
 *
 * @apiParam {Number} id 讲师id
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
router.get("/teacher_detail/:id", (req, res) => {
    const {id} = req.params;
    if (!id) {
        res.send(res.utils.ResponseTemp(400, false, "必须填写参数id"));
        return;
    }
    Promise.all([res.utils.execSQL(`
        SELECT
            id,
            name,
            header,
            position,
            intro,
            is_star
        FROM
            t_teacher
        WHERE
            id = ${id};
    `), res.utils.execSQL(`
                SELECT
                    t_course.id,
                    teacher_id,
                    title,
                    fm_url,
                    is_hot,
                    count( t_comments.id ) AS comment_total_count,
                    AVG( IFNULL(t_comments.score, 0) ) AS comment_avg_score
                FROM
                    t_course
                LEFT JOIN t_comments ON t_course.id = t_comments.course_id
                GROUP BY
                    t_course.id
                HAVING
                    teacher_id = ${id};
            `)]).then(([teacherResult, courseResult]) => {
        console.log(teacherResult, courseResult);
        if (teacherResult.length >= 1) {
            let teacher = teacherResult[0];
            teacher.courses = courseResult;
            res.send(res.utils.ResponseTemp(200, true, "获取成功", teacher))
        } else {
            res.send(res.utils.ResponseTemp(200, true, "获取成功", {}))
        }
    })
})

module.exports = router;
