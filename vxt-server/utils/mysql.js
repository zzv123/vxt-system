const mysql = require("mysql");
const config = require("../config/config");

let pool  = mysql.createPool({
    connectionLimit : 10,
    host            : config.DataHost,
    port            : config.DataPort,
    user            : config.UserName,
    password        : config.PassWord,
    database        : config.DataBase
})

function execSQL(sqlTemp,values=[], successCB, failCB) {
    return new Promise((resolve, reject) => {
        pool.query(sqlTemp, values, function (error, results, fields) {
            if (error) {
                if (typeof failCB === "function") {
                    failCB(error);
                }
                reject(error)
            } else {
                if (typeof successCB === "function") {
                    successCB(results);
                }
                resolve(results)
            }
        });
    })
}

module.exports = {
    execSQL
}
