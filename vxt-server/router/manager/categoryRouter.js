let express = require('express');
let router = express.Router();

/**
 * @api {get} /api/manager/category/category_list 后台获取分类列表
 * @apiName 后台获取分类列表
 * @apiGroup Category
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
router.get("/category_list", (req, res) => {
    let sql = `select id, title from t_course_category where parent_id=0;`;
    res.utils.execSQLAutoResponse(sql)
})

/**
 * @api {post} /api/manager/category/category_update 后台编辑分类
 * @apiName 后台编辑分类
 * @apiGroup Category
 *
 * @apiParam {Number} id 分类id
 * @apiParam {String} title 分类名称
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
router.post("/category_update", (req, res) => {
    const {id, title} = req.body
    if (!id) {
        res.json(res.utils.ResponseTemp(400, false, "请传入参数ID", {}))
        return null;
    }
    // 2. 更新
    let sql = `update t_course_category set title=? where id=?;`
    res.utils.execSQLTEMPAutoResponse(sql, [title, id], "更新成功", result => ({
        id,
        title
    }))

})

/**
 * @api {get} /api/manager/category/category_delete 后台删除分类
 * @apiName 后台删除分类
 * @apiGroup Category
 *
 * @apiParam {Number} id 分类id
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
router.get("/category_delete", (req, res) => {
    const {id} = req.query
    if (!id) {
        if (!id) {
            res.json(res.utils.ResponseTemp(400, false, "请传入参数ID", {}))
            return null;
        }
        return null;
    }
    // 2. 删除记录
    let sql = `delete from t_course_category where id=?;`
    res.utils.execSQLTEMPAutoResponse(sql, [id], "删除成功", result => ({
        del_id: id
    }))

})

/**
 * @api {post} /api/manager/category/category_add 后台新增分类
 * @apiName 后台新增分类
 * @apiGroup Category
 *
 * @apiParam {String} title 分类名称
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
router.post("/category_add", (req, res) => {
    const {title} = req.body
    let sql = `
        insert into t_course_category (title) values (?);
    `
    res.utils.execSQLTEMPAutoResponse(sql, [title], "新增成功", result => {
        if (result.affectedRows === 1) {
            return {
                id: result.insertId,
                title
            }
        } else {
            return {}
        }
    })
})


module.exports = router;
