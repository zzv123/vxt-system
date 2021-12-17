let express = require('express');
let router = express.Router();

/**
 * @api {get} /api/manager/article/article_list 后台获取文章列表
 * @apiName 后台获取文章列表
 * @apiGroup Article
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
router.get("/article_list", (req, res) => {
    let sql = `select id, title, intro, create_time from t_news order by create_time desc;`
    res.utils.execSQLAutoResponse(sql)
})

/**
 * @api {get} /api/manager/article/article_detail 后台获取文章详情
 * @apiName 后台获取文章详情
 * @apiGroup Article
 *
 * @apiParam {Number} id 文章id
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "successful": true,
 *       "msg": "查询详情成功",
 *       "data": "data"
 *     }
 */
router.get("/article_detail/:id", (req, res) => {
    const {id} = req.params
    let sql = `select id, title, intro, content, create_time from t_news where id=?;`
    res.utils.execSQLTEMPAutoResponse(sql, [id], "查询详情成功", result=>{
        if (result.length > 0) return result[0];
        return {}
    })
})

/**
 * @api {get} /api/manager/article/article_delete 后台删除文章
 * @apiName 后台删除文章
 * @apiGroup Article
 *
 * @apiParam {Number} id 文章id
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
router.get("/article_delete", (req, res) => {
    const {id} = req.query
    let sql = `delete from t_news where id = ?;`
    res.utils.execSQLTEMPAutoResponse(sql, [id], "删除成功", result=>({}))
})

/**
 * @api {post} /api/manager/article/article_add 后台新增文章
 * @apiName 后台新增文章
 * @apiGroup Article
 *
 * @apiParam {String} title 文章标题
 * @apiParam {String} intro 文章简介
 * @apiParam {String} content 文章内容
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
router.post("/article_add", (req, res) => {
    const {title, intro, content} = req.body
    let sql = `
        insert into t_news (title, intro, content) values (?, ?, ?);
    `
    res.utils.execSQL(sql, [title, intro, content], result=>{
        res.utils.execSQLTEMPAutoResponse("select * from t_news where id=?;", [result.insertId], "新增成功", result=>result[0])
    })
})

/**
 * @api {get} /api/manager/article/article_update 后台更新文章
 * @apiName 后台更新文章
 * @apiGroup Article
 *
 * @apiParam {Number} id 文章id
 * @apiParam {String} title 文章标题
 * @apiParam {String} intro 文章简介
 * @apiParam {String} content 文章内容
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
router.post("/article_update", (req, res) => {
    const {id, title, intro, content} = req.body
    let sql = `
        update t_news set title=?, intro=?, content=? where id=?;
    `
    res.utils.execSQL(sql, [title, intro, content, id],result=>{
        res.utils.execSQLTEMPAutoResponse("select * from t_news where id = ?;", [id], "更新成功", result=>result[0]);
    })
})


module.exports = router;
