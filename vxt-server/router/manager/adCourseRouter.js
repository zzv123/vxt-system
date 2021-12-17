const express = require('express');
const fs = require("fs");
const path = require("path");
const multer = require("multer");

let router = express.Router();

/**
 * @api {get} /api/manager/ad_course/delete_file 后台删除文件
 * @apiName 后台删除文件
 * @apiGroup AdCourse
 *
 * @apiParam {String} file_path 图片路径
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
        res.send(res.utils.ResponseTemp(400, false,"请传入图片路径", {}))
        return null;
    }
    let fileFullPath = path.resolve(__dirname, "../../public" + file_path)
    fs.unlink(fileFullPath, err => {
        if (err) {
            res.send(res.utils.ResponseTemp(400,false, "删除失败", {}))
        } else {
            res.send(res.utils.ResponseTemp(200,true, "删除成功", {}))
        }
    })
})

/**
 * @api {get} /api/manager/ad_course/ad_course_delete 后台删除焦点图
 * @apiName 后台删除焦点图
 * @apiGroup AdCourse
 *
 * @apiParam {Number} id 焦点图id
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "删除记录成功",
 *       "data": "data"
 *     }
 */
router.get("/ad_course_delete", (req, res) => {
    const {id} = req.query
    if (!id) {
        res.send(res.utils.ResponseTemp(400, false,"请传入要删除的焦点图ID", {}))
        return null;
    }
    // 1. 删除对应的图片
    res.utils.execSQL("select ad_url from t_ad where id=?", [id]).then(result => {
        if (result.length > 0) {
            let filePath = path.resolve(__dirname, "../../public" + result[0].ad_url)
            fs.unlink(filePath, err => {
                // 2. 删除记录
                let sql = `delete from t_ad where id=?;`;
                res.utils.execSQLTEMPAutoResponse(sql, [id], "删除记录成功", result => ({}))
            })
        }
    })

})

/**
 * @api {get} /api/manager/ad_course/link_course 后台获取关联课程列表
 * @apiName 后台获取关联课程列表
 * @apiGroup AdCourse
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
router.get("/link_course", (req, res) => {
    let sql = `select id, title from t_course;`
    res.utils.execSQLAutoResponse(sql);
})

/**
 * @api {get} /api/manager/ad_course/ad_course_list 后台获取焦点图列表
 * @apiName 后台获取焦点图列表
 * @apiGroup AdCourse
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
router.get("/ad_course_list", (req, res) => {
    res.utils.execSQLAutoResponse(`
    SELECT
        ta.id AS id,
        ta.title,
        ta.ad_url,
        ta.course_id,
        tc.title AS course_title,
        tc.fm_url 
    FROM
        t_ad AS ta
        LEFT JOIN t_course AS tc ON ta.course_id = tc.id;
    `)
})

/**
 * @api {post} /api/manager/ad_course/upload_ad_img 后台焦点图图片上传
 * @apiName 后台焦点图图片上传
 * @apiGroup AdCourse
 *
 * @apiParam {File} ad_img 图片文件
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
let uploader = multer({dest: path.resolve(__dirname, "../../public/images/banner")})
router.post("/upload_ad_img", uploader.single("ad_img"), (req, res) => {
    let file = req.file;
    let extName = path.extname(file.originalname);
    fs.renameSync(file.path, path.resolve(__dirname, "../../public/images/banner", file.filename + extName))
    let newPath = `/images/banner/${file.filename + extName}`;
    res.send(res.utils.ResponseTemp(200,true, "图片上传成功", {file_path: newPath}))
})

/**
 * @api {post} /api/manager/ad_course/ad_course_add 后台新增焦点图
 * @apiName 后台新增焦点图
 * @apiGroup AdCourse
 *
 * @apiParam {String} title 焦点图标题
 * @apiParam {String} ad_url 焦点图封面url
 * @apiParam {Number} course_id 关联的课程id
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
router.post("/ad_course_add", (req, res) => {
    const {title, ad_url, course_id} = req.body
    let sql = `
        insert into t_ad (title, ad_url, course_id) values (?, ?, ?);
    `
    res.utils.execSQLTEMPAutoResponse(sql, [title, ad_url, course_id], "插入成功", result => {
        return {
            insertId: result.insertId
        }
    })
})

/**
 * @api {post} /api/manager/ad_course/ad_course_update 后台编辑焦点图
 * @apiName 后台编辑焦点图
 * @apiGroup AdCourse
 * @apiParam {Number} id 焦点图id
 * @apiParam {String} title 焦点图标题
 * @apiParam {String} ad_url 焦点图封面url
 * @apiParam {Number} course_id 关联的课程id
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
router.post("/ad_course_update", (req, res) => {
    const {id, title, ad_url, course_id} = req.body
    let sql = `
        update t_ad set title=?, ad_url =?, course_id=? where id=?;
    `
    res.utils.execSQLTEMPAutoResponse(sql, [title, ad_url, course_id, id], "更新成功", result => {
        return {
            id
        }
    })
})

module.exports = router;
