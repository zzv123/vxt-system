const path = require("path");
const fs = require("fs");
const {getCurrentTime} = require("../utils/dateTime");
const {sendMail} = require("../utils/email");
const {execSQL} = require("../utils/mysql");

// 跨域中间件
let crossDomainM = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With,token");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    next();
}

// 404中间件
let notFoundMF = function (notFoundFilePath) {
    if (!path.isAbsolute(notFoundFilePath)) {
        throw Error("必须要传递一个绝对路径")
    }
    return (req, res) => {
        res.status(404).sendFile(notFoundFilePath)
    }
}

// 日志中间件
let rizhiMF = function (rizhiFilePath) {
    if (!path.isAbsolute(rizhiFilePath)) {
        throw Error("必须要传递一个绝对路径")
    }
    return (req, res, next) => {
        // 日志记录
        let current = getCurrentTime();
        let method = req.method;
        let path = req.path;
        let params = {};
        if (method.toLowerCase() === "get") {
            params = req.query;
        } else if (method.toLowerCase() === "post") {
            params = req.body;
        }
        let ua = req.headers["user-agent"];

        execSQL("insert into log (method, path, params, user_agent) values (?, ?, ?, ?);", [method, path, JSON.stringify(params), ua]).then(result => {
            console.log("记录日志成功!")
        })
        let result = `
=============================================
请求时间: ${current}
请求方法: ${method}
请求路径: ${path}
请求参数: ${JSON.stringify(params)}
客户端信息: ${ua}
=============================================
                     `
        fs.appendFile(rizhiFilePath, result, () => {
            console.log("写入日志成功")
        })
        // 继续传递请求 响应 next
        next()
    }
}

// 错误中间件
let handlerErrorMF = function (errorFilePath, errorResponseFilePath) {
    if (!path.isAbsolute(errorFilePath) || !path.isAbsolute(errorResponseFilePath)) {
        throw Error("请传入一个绝对路径")
    }
    return (err, req, res, next) => {
        let err_type = err.name;
        let err_msg = err.message;
        let err_stack = err.stack;
        execSQL("insert into error (err_type, err_msg, err_stack) values (?, ?, ?);", [err_type, err_msg, JSON.stringify(err_stack)])
            .then(result => {
                if (result.affectedRows >= 1) {
                    let info = `
=======================================
错误类型: ${err_type}
错误描述: ${err_msg}
错误时间: ${getCurrentTime()}
错误堆栈: ${err_stack}
=======================================
                                `
                    fs.appendFile(errorFilePath, info, () => {
                        sendMail("3108363503@qq.com", "错误报告", info)
                    })
                }
            })
        res.status(500).sendFile(errorResponseFilePath)
    }
}

// 工具中间件
let toolM = (req, res, next) => {
    res.utils = {
        execSQL,
        ResponseTemp: function (code, successful, msg, data) {
            return {
                code,
                successful,
                msg,
                data
            }
        },
        execSQLAutoResponse: function (sql, successMsg = "查询成功", handlerResultF = result => result) {
            execSQL(sql).then(result => {
                res.send(this.ResponseTemp(200, true, successMsg, handlerResultF(result)))
            }).catch(error => {
                res.send(this.ResponseTemp(500, false, "api出现错误", {}))
            })
        },
        execSQLTEMPAutoResponse: function (sqlTEMP, values = [], successMsg = "查询成功", handlerResultF = result => result) {
            execSQL(sqlTEMP, values).then(result => {
                res.send(this.ResponseTemp(200, true, successMsg, handlerResultF(result)))
            }).catch(error => {
                res.send(this.ResponseTemp(500, false, "api出现错误", {}))
            })
        }
    }
    next();
}
module.exports = {
    notFoundMF,
    rizhiMF,
    handlerErrorMF,
    crossDomainM,
    toolM
}
