let express = require('express');
let fs = require("fs");
let path = require("path");
let multer = require("multer");

let router = express.Router();

/**
 * @api {post} /api/manager/teacher/upload_header 后台讲师头像上传
 * @apiName 后台讲师头像上传
 * @apiGroup Teacher
 *
 * @apiParam {File} header 头像图片
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
let headerUploader = multer({dest: path.resolve(__dirname, "../../public/images/teacher")})
router.post("/upload_header", headerUploader.single("header"), (req, res) => {
    let file = req.file;
    let extName = path.extname(file.originalname);
    fs.renameSync(file.path, path.resolve(__dirname, "../../public/images/teacher", file.filename + extName))
    let newPath = `/images/teacher/${file.filename + extName}`;
    res.send(res.utils.ResponseTemp(200,true,"图片上传成功", {file_path: newPath}))
})

/**
 * @api {get} /api/manager/teacher/delete_file 后台删除文件
 * @apiName 后台删除文件
 * @apiGroup Teacher
 *
 * @apiParam {String} file_path 文件路径
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "图片删除成功",
 *       "data": "data"
 *     }
 */
router.get("/delete_file", (req, res) => {
    const {file_path} = req.query
    if (!file_path) {
        res.send(res.utils.ResponseTemp(400,false,"请传入图片途径: file_path",{}))
        return null;
    }
    let fileFullPath = path.resolve(__dirname, "../../public" + file_path)
    fs.unlink(fileFullPath, err => {
        if (err) {
            res.send(res.utils.ResponseTemp(400,false,"图片删除失败",{}))
        } else {
            res.send(res.utils.ResponseTemp(200,true,"图片删除成功",{}))
        }
    })
})

/**
 * @api {get} /api/manager/teacher/teacher_delete 后台删除讲师
 * @apiName 后台删除讲师
 * @apiGroup Teacher
 *
 * @apiParam {Number} id 讲师id
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
router.get("/teacher_delete", (req, res) => {
    const {id} = req.query
    if (!id) {
        res.send(res.utils.ResponseTemp(400,false,"请传入id",{}))
        return null;
    }

    // 1. 删除对应的图片
    res.utils.execSQL(`select header from t_teacher where id=?;`, [id], result => {
        if (result.length > 0) {
            let filePath = path.resolve(__dirname, "../../public" + result[0].header)
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
            // 2. 删除记录
            let sql = `delete from t_teacher where id=?;`
            res.utils.execSQL(sql, [id], result => {
                if (result.affectedRows > 0) {
                    res.send(res.utils.ResponseTemp(200,true,"删除成功",{}))
                } else {
                    res.send(res.utils.ResponseTemp(400,false,"删除失败",{}))
                }

            })

        }
    })

})

/**
 * @api {get} /api/manager/teacher/teacher_list 后台获取讲师列表
 * @apiName 后台获取讲师列表
 * @apiGroup Teacher
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
    let sql = `select * from t_teacher;`
    res.utils.execSQLAutoResponse(sql);
})

/**
 * @api {post} /api/manager/teacher/teacher_add 后台新增讲师
 * @apiName 后台新增讲师
 * @apiGroup Teacher
 *
 * @apiParam {String} name 讲师姓名
 * @apiParam {Number} is_star 是否为星级讲师 0为否 1为是
 * @apiParam {String} intro 讲师简介
 * @apiParam {String} header 讲师头像url
 * @apiParam {String} position 讲师职位
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "新增成功",
 *       "data": "data"
 *     }
 */
router.post("/teacher_add", (req, res) => {
    const {name, is_star, intro, header, position} = req.body
    let sql = `
        insert into t_teacher (name, is_star, intro, header, position) values (?, ?, ?, ?, ?);
    `
    res.utils.execSQLTEMPAutoResponse(sql, [name, is_star, intro, header, position], "新增成功", result=>{
        if (result.affectedRows > 0) {
            return {
                id: result.insertId,
                name, is_star, intro, header, position
            }
        }
        return {}
    })
})

/**
 * @api {post} /api/manager/teacher/teacher_update 后台编辑讲师
 * @apiName 后台编辑讲师
 * @apiGroup Teacher
 *
 * @apiParam {Number} id 讲师id
 * @apiParam {String} name 讲师姓名
 * @apiParam {Number} is_star 是否为星级讲师 0为否 1为是
 * @apiParam {String} intro 讲师简介
 * @apiParam {String} header 讲师头像url
 * @apiParam {String} position 讲师职位
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
router.post("/teacher_update", (req, res) => {
    const {id, name, is_star, intro, header, position} = req.body;
    if (!id) {
        res.send(res.utils.ResponseTemp(400,false,"请传入id",{}))
        return null;
    }
    let sql = `
        update t_teacher set name=?, is_star=?, intro=?, header=?, position=? where id=?;
    `
    res.utils.execSQLTEMPAutoResponse(sql, [name, is_star, intro, header, position, id], "更新成功", result => {
        return {id, name, is_star, intro, header, position}
    })
})

/**
 * @api {post} /api/manager/teacher/update_is_star 后台设置是否为星级讲师
 * @apiName 后台设置是否为星级讲师
 * @apiGroup Teacher
 *
 * @apiParam {Number} id 讲师id
 * @apiParam {Number} is_star 是否为星级讲师 0为否 1为是
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
router.post("/update_is_star", (req, res) => {
    const {id, is_star} = req.body
    if (!id) {
        res.send(res.utils.ResponseTemp(400,false,"请传入id",{}))
        return null;
    }
    let sql = `update t_teacher set is_star=? where id=?;`
    res.utils.execSQLTEMPAutoResponse(sql, [is_star, id], "更新成功", result => {
        return {id, is_star}
    })
})

module.exports = router;
