let express = require('express');
let fs = require("fs");
let path = require("path");
let multer = require("multer");
let router = express.Router();

/**
 * @api {post} /api/manager/course/upload_fm 后台课程封面上传
 * @apiName 后台课程封面上传
 * @apiGroup Course
 *
 * @apiParam {File} fm 课程封面
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "图片上传成功",
 *       "data": "data"
 *     }
 */
let fm_uploader = multer({dest: path.resolve(__dirname, "../../public/images/course")})
router.post("/upload_fm", fm_uploader.single("fm"), (req, res) => {
    let file = req.file;
    let extName = path.extname(file.originalname);
    fs.renameSync(file.path, path.resolve(__dirname, "../../public/images/course", file.filename + extName))
    let newPath = `/images/course/${file.filename + extName}`;
    res.send(res.utils.ResponseTemp(200, true, "图片上传成功", {file_path: newPath}))
})

/**
 * @api {post} /api/manager/course/upload_video 后台课程视频上传
 * @apiName 后台课程视频上传
 * @apiGroup Course
 *
 * @apiParam {File} video 课程视频
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "视频上传成功",
 *       "data": "data"
 *     }
 */
let video_uploader = multer({dest: path.resolve(__dirname, "../../public/videos")})
router.post("/upload_video", video_uploader.single("video"), (req, res) => {
    let file = req.file;
    let extName = path.extname(file.originalname);
    fs.renameSync(file.path, path.resolve(__dirname, "../../public/videos", file.filename + extName));
    let newPath = `/videos/${file.filename + extName}`;
    res.send(res.utils.ResponseTemp(200, true, "视频上传成功", {file_path: newPath}));
})

/**
 * @api {get} /api/manager/course/delete_file 后台删除文件
 * @apiName 后台删除文件
 * @apiGroup Course
 *
 * @apiParam {String} file_path 文件路径
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "删除成功",
 *       "data": "data"
 *     }
 */
router.get("/delete_file", (req, res) => {
    const {file_path} = req.query
    if (!file_path) {
        res.send(res.utils.ResponseTemp(400, false, "请传入要删除的文件路径", {}))
        return null;
    }
    let fileFullPath = path.resolve(__dirname, "../../public" + file_path)
    fs.unlink(fileFullPath, err => {
        if (err) {
            res.send(res.utils.ResponseTemp(400, false, "删除文件失败", {}))
        } else {
            res.send(res.utils.ResponseTemp(200, true, "删除成功", {}))
        }
    })
})

/**
 * @api {get} /api/manager/course/course_delete 后台删除课程
 * @apiName 后台删除课程
 * @apiGroup Course
 *
 * @apiParam {Number} id 课程id
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "删除成功",
 *       "data": "data"
 *     }
 */
router.get("/course_delete", (req, res) => {
    const {id} = req.query
    if (!id) {
        res.send(res.utils.ResponseTemp(400, false, "请传入课程ID", {}))
        return null;
    }

    // 1. 删除对应的图片
    res.utils.execSQL(`select fm_url from t_course where id=?`, [id], result => {
        if (result.length > 0) {
            let filePath = path.resolve(__dirname, "../../public" + result[0].fm_url)
            fs.unlink(filePath, err => {
                // 2. 删除记录
                let sql = `delete from t_course where id=?;`
                res.utils.execSQL(sql, [id], result => {
                    if (result.affectedRows === 1) {
                        res.send(res.utils.ResponseTemp(200, true, "删除成功", {id}))
                    } else {
                        res.send(res.utils.ResponseTemp(400, false, "删除失败", {id}))
                    }
                })

            })
        } else {
            res.send(res.utils.ResponseTemp(400, false, "ID对应记录不存在", {}))
        }
    })
})

/**
 * @api {get} /api/manager/course/course_list 后台获取课程列表
 * @apiName 后台获取课程列表
 * @apiGroup Course
 *
 * @apiParam {Number} page_num 页码
 * @apiParam {Number} page_size 条数
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "获取数据成功",
 *       "data": "data"
 *     }
 */
router.get("/course_list", (req, res) => {
    let {page_num = 1, page_size = 10} = req.query;
    page_num = +page_num;
    page_size = +page_size;
    let sql = `select id, title, fm_url, is_hot, category_id, teacher_id from t_course limit ?,?;`;
    res.utils.execSQL(sql, [(page_num - 1) * page_size, page_size], course_list => {
        res.utils.execSQL("select count(*) as total_count from t_course;", [], result => {
            res.send(res.utils.ResponseTemp(200, true, "获取数据成功", {
                course_list,
                total_count: result[0].total_count
            }))
        })

    })
})

/**
 * @api {get} /api/manager/course/course_intro 后台获取课程介绍
 * @apiName 后台获取课程介绍
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
router.get("/course_intro", (req, res) => {
    const {id} = req.query;
    if (!id) {
        res.send(res.utils.ResponseTemp(400, false, "请传入课程ID", {}))
        return;
    }
    let sql = `select id, intro from t_course where id=?;`
    res.utils.execSQLTEMPAutoResponse(sql, [id], result => {
        if (result.length > 0) return result[0];
        return {}
    })
})

/**
 * @api {get} /api/manager/course/own_teachers 后台获取所属老师列表
 * @apiName 后台获取所属老师列表
 * @apiGroup Course
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "查询成功",
 *       "data": "data"
 *     }
 */
router.get("/own_teachers", (req, res) => {
    let sql = `select id, name from t_teacher;`;
    res.utils.execSQLAutoResponse(sql);
})

/**
 * @api {get} /api/manager/course/own_categories 后台获取所属分类列表
 * @apiName 后台获取所属分类列表
 * @apiGroup Course
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "查询成功",
 *       "data": "data"
 *     }
 */
router.get("/own_categories", (req, res) => {
    let sql = `select id, title from t_course_category where parent_id=0;`
    res.utils.execSQLAutoResponse(sql);
})

/**
 * @api {get} /api/manager/course/course_outlines 后台获取课程大纲
 * @apiName 后台获取课程大纲
 * @apiGroup Course
 *
 * @apiParam {Number} course_id 课程id
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
router.get('/course_outlines', (req, res) => {
    const {course_id} = req.query
    if (!course_id) {
        res.send(res.utils.ResponseTemp(400, false, "请传入课程ID", {}))
        return;
    }
    let sql = `
        select
        id,
        title,
        video_url,
        num
        from 
        t_course_outline
        where
        t_course_outline.course_id = ${course_id}
        order by
        num;
    `
    res.utils.execSQLAutoResponse(sql);
})

/**
 * @api {get} /api/manager/course/course_comments 后台获取课程评论
 * @apiName 后台获取课程评论
 * @apiGroup Course
 *
 * @apiParam {Number} course_id 课程id
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
router.get("/course_comments", (req, res) => {
    const {course_id} = req.query
    if (!course_id) {
        res.send(res.utils.ResponseTemp(400, false, "请传入课程ID", {}))
        return;
    }
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
        tc.course_id = ?
        ORDER BY
        create_time DESC
    `
    res.utils.execSQLTEMPAutoResponse(sql, [course_id])
})

/**
 * @api {get} /api/manager/course/course_detail 后台获取课程详情
 * @apiName 后台获取课程详情
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
router.get("/course_detail", (req, res) => {
    const {id} = req.query
    if (!id) {
        res.send(res.utils.ResponseTemp(400, false, "请传入课程ID", {}))
        return;
    }
    let sql = `select * from t_course where id=?;`
    res.utils.execSQLTEMPAutoResponse(sql, [id], "查询课程详情成功!", result => {
        if (result.length > 0) return result[0];
        return {}
    })
})

/**
 * @api {post} /api/manager/course/course_add 后台新增课程
 * @apiName 后台新增课程
 * @apiGroup Course
 *
 * @apiParam {String} title 课程标题
 * @apiParam {String} fm_url 封面图片url
 * @apiParam {Number} is_hot 是否热门 0为否 1为是
 * @apiParam {String} intro 课程简介
 * @apiParam {Number} teacher_id 讲师id
 * @apiParam {Number} category_id 分类id
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "插入成功",
 *       "data": "data"
 *     }
 */
router.post("/course_add", (req, res) => {
    const {title, fm_url, is_hot, intro, teacher_id, category_id} = req.body
    let sql = `
        insert into t_course (title, fm_url, is_hot, intro, teacher_id, category_id) values (?, ?, ?, ?, ?, ?);
    `;
    res.utils.execSQLTEMPAutoResponse(sql, [title, fm_url, is_hot, intro, teacher_id, category_id], "插入成功", result => {
        if (result.affectedRows > 0) {
            return {
                id: result.insertId,
                title, fm_url, is_hot, intro, teacher_id, category_id
            }
        }
        return {}
    })
})

/**
 * @api {post} /api/manager/course/course_update 后台编辑课程
 * @apiName 后台编辑课程
 * @apiGroup Course
 *
 * @apiParam {Number} id 课程id
 * @apiParam {String} title 课程标题
 * @apiParam {String} fm_url 封面图片url
 * @apiParam {Number} is_hot 是否热门 0为否 1为是
 * @apiParam {String} intro 课程简介
 * @apiParam {Number} teacher_id 讲师id
 * @apiParam {Number} category_id 分类id
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
router.post("/course_update", (req, res) => {
    const {id, title, fm_url, is_hot, intro, teacher_id, category_id} = req.body;

    res.utils.execSQL("select fm_url from t_course where id=?;", [id]).then(result => {
        if (result.length > 0) {
            let oldPath = result[0].fm_url;
            fs.unlink(path.resolve(__dirname, "../../public/", "." + oldPath), () => {
                let sql = `
        update t_course set title=?, fm_url=?, is_hot=?, intro=?, teacher_id=? ,category_id=? where id=?;
    `
                res.utils.execSQLTEMPAutoResponse(sql, [title, fm_url, is_hot, intro, teacher_id, category_id, id], "更新成功", result => {
                    if (result.affectedRows > 0) {
                        return {
                            id, title, fm_url, is_hot, intro, teacher_id, category_id
                        }
                    }
                    return {}
                })
            })
        }
    })
})

/**
 * @api {post} /api/manager/course/update_is_hot 后台修改课程是否为热门
 * @apiName 后台修改课程是否为热门
 * @apiGroup Course
 *
 * @apiParam {Number} id 课程id
 * @apiParam {Number} is_hot 是否热门 0为否 1为是
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "更新热门成功",
 *       "data": "data"
 *     }
 */
router.post("/update_is_hot", (req, res) => {
    const {id, is_hot} = req.body
    let sql = `update t_course set is_hot=? where id=?;`
    res.utils.execSQLTEMPAutoResponse(sql, [is_hot, id], "更新热门成功", result => {
        if (result.affectedRows > 0) {
            return {
                id, is_hot
            }
        }
        return {
            id, is_hot
        }
    })
})

/**
 * @api {post} /api/manager/course/update_teacher 后台修改课程所属老师
 * @apiName 后台修改课程所属老师
 * @apiGroup Course
 *
 * @apiParam {Number} id 课程id
 * @apiParam {Number} teacher_id 讲师id
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "更新所属讲师成功",
 *       "data": "data"
 *     }
 */
router.post("/update_teacher", (req, res) => {
    const {id, teacher_id} = req.body
    let sql = `update t_course set teacher_id=? where id=?;`
    res.utils.execSQLTEMPAutoResponse(sql, [teacher_id, id], "更新所属讲师成功", result => {
        if (result.affectedRows > 0) {
            return {
                id, teacher_id
            }
        }
        return {
            id, teacher_id
        }
    })
})

/**
 * @api {post} /api/manager/course/update_category 后台修改课程所属分类
 * @apiName 后台修改课程所属分类
 * @apiGroup Course
 *
 * @apiParam {Number} id 课程id
 * @apiParam {Number} category_id 讲师id
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "更新所属分类成功",
 *       "data": "data"
 *     }
 */
router.post("/update_category", (req, res) => {
    const {id, category_id} = req.body
    let sql = `update t_course set category_id=? where id=?;`
    res.utils.execSQLTEMPAutoResponse(sql, [category_id, id], "更新所属分类成功", result => {
        if (result.affectedRows > 0) {
            return {
                id, category_id
            }
        }
        return {
            id, category_id
        }
    })
})

/**
 * @api {post} /api/manager/course/add_outline 后台新增课程大纲
 * @apiName 后台新增课程大纲
 * @apiGroup Course
 *
 * @apiParam {Number} course_id 课程id
 * @apiParam {Number} num 序号
 * @apiParam {String} title 标题
 * @apiParam {String} video_url 视频url
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "新增大纲成功",
 *       "data": "data"
 *     }
 */
router.post('/add_outline', function (req, res) {
    const {course_id, num, title, video_url} = req.body
    let sql = `
        insert into t_course_outline (course_id, num, title, video_url) values (?, ?, ?, ?)
    `
    res.utils.execSQLTEMPAutoResponse(sql, [course_id, num, title, video_url], "新增大纲成功", result => {
        if (result.affectedRows > 0) {
            return {
                id: result.insertId,
                course_id, num, title, video_url
            }
        }
        return {}
    })
})

/**
 * @api {get} /api/manager/course/del_outline 后台删除课程大纲
 * @apiName 后台删除课程大纲
 * @apiGroup Course
 *
 * @apiParam {Number} outline_id 大纲id
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "删除成功",
 *       "data": "data"
 *     }
 */
router.get('/del_outline', function (req, res) {
    const {outline_id} = req.query
    if (!outline_id) {
        res.send(res.utils.ResponseTemp(400, false, "请传入需要删除的大纲ID", {}))
        return null;
    }
    // 1. 删除对应的视频
    res.utils.execSQL(`select video_url from t_course_outline where id=?`, [outline_id], result => {
        if (result.length > 0) {
            let filePath = path.resolve(__dirname, "../../public", "." + result[0].video_url)
            fs.unlink(filePath, err => {
                // 2. 删除记录
                let sql = `delete from t_course_outline where id=?;`
                res.utils.execSQL(sql, [outline_id], result => {
                    if (result.affectedRows === 1) {
                        res.send(res.utils.ResponseTemp(200, true, "删除成功", {outline_id}))
                    } else {
                        res.send(res.utils.ResponseTemp(400, false, "删除失败", {outline_id}))
                    }
                })

            })
        }
    })

})

module.exports = router;
