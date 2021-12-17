const express = require("express");

let router = express.Router();

/**
 * @api {get} /api/client/article/article_list 前台获取文章列表
 * @apiName 前台获取文章列表
 * @apiGroup Article
 *
 * @apiParam {Number} page_num 页码
 * @apiParam {Number} page_size 条数
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
router.get("/article_list",(req,res)=> {
    const {page_num = 1, page_size = 5} = req.query;
    res.utils.execSQLAutoResponse(`
        SELECT
            id,
            title,
            intro,
            create_time
        FROM
            t_news
        ORDER BY
            create_time DESC
        LIMIT ${(page_num - 1) * page_size}, ${page_size};
    `,"查询成功")
})

/**
 * @api {get} /api/client/article/article_detail 前台获取文章详情
 * @apiName 前台获取文章详情
 * @apiGroup Article
 *
 * @apiParam {Number} id 文章id
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
router.get("/article_detail/:id",(req,res)=>{
    const {id} = req.params
    res.utils.execSQLAutoResponse(`
        SELECT
            id,
            title,
            create_time,
            content
        FROM
            t_news
        WHERE 
            id = ${id};
    `,"获取成功",results=>{
        if (results.length >= 1) {
            return results[0]
        } else {
            return {}
        }
    })
})


module.exports = router;
