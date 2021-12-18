const express = require('express');
const fs = require("fs");
const path = require("path");
const multer = require("multer");
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
 * @api {get} /api/manager/config/delete_file 后台删除文件
 * @apiName 后台删除文件
 * @apiGroup Config
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
        res.send(res.utils.ResponseTemp(400, false, "请传入要删除的图片路径: file_path", {}))
        return null;
    }
    let fileFullPath = path.resolve(__dirname, "../../public" + file_path)
    fs.unlink(fileFullPath, err => {
        if (err) {
            res.send(res.utils.ResponseTemp(400, false, "删除失败", {file_path}))
        } else {
            res.send(res.utils.ResponseTemp(200, true, "删除成功", {file_path}))
        }
    })
})

/**
 * @api {post} /api/manager/config/upload_img 后台上传图片
 * @apiName 后台上传图片
 * @apiGroup Config
 *
 * @apiParam {File} img 图片文件
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
const uploader = multer({dest: path.resolve(__dirname, "../../public/images/config")})
router.post("/upload_img", uploader.single("img"), (req, res) => {
    let file = req.file;
    let extName = path.extname(file.originalname);
    fs.renameSync(file.path, path.resolve(__dirname, "../../public/images/config", file.filename + extName))
    let newPath = `/images/config/${file.filename + extName}`;
    res.send(res.utils.ResponseTemp(200, true, "图片上传成功", {file_path: newPath}))
})

/**
 * @api {get} /api/manager/config/config_detail 后台获取联系信息
 * @apiName 后台获取联系信息
 * @apiGroup Config
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "获取联系信息成功",
 *       "data": "data"
 *     }
 */
router.get("/config_detail", (req, res) => {
    let sql = `select id, wechat_qrcode, mini_program, wb_qrcode, app, tel from t_config order by id limit 1;`
    res.utils.execSQLAutoResponse(sql, "获取联系信息成功!", result => {
        if (result.length > 0) return result[0];
        return {}
    })
})

/**
 * @api {post} /api/manager/config/config_update 后台更新配置信息
 * @apiName 后台更新配置信息
 * @apiGroup Config
 *
 * @apiParam {Number} id 网站id
 * @apiParam {String} tel 电话号码
 * @apiParam {String} wechat_qrcode 微信图片url
 * @apiParam {String} mini_program 小程序图片url
 * @apiParam {String} wb_qrcode 微博图片url
 * @apiParam {String} app app图片url
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
router.post("/config_update", (req, res) => {
    const {wechat_qrcode, mini_program, tel, wb_qrcode, app, id} = req.body;
    if (!id) {
        res.send(res.utils.ResponseTemp(400, false, "请传入ID", {}));
        return;
    }

    let sql = `
        update t_config set wechat_qrcode=?, mini_program =?, tel=?, wb_qrcode=?, app=? where id=?;
    `
    res.utils.execSQLTEMPAutoResponse(sql, [wechat_qrcode, mini_program, tel, wb_qrcode, app, id], "更新成功", result => {
        if (result.affectedRows === 1) {
            return {wechat_qrcode, mini_program, tel, wb_qrcode, app, id}
        } else {
            return {}
        }
    })
})

module.exports = router;
