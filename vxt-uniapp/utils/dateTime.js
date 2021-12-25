// 获取当前时间 YYYY-MM-DD HH:MM:SS
function getCurrentTimeStr() {
    let nowDate = new Date();
    let year = nowDate.getFullYear();
    let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
    let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
    let hour = nowDate.getHours();
    let minute = nowDate.getMinutes();
    let second = nowDate.getSeconds();
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// 获取当前日期 YYYY-MM-DD
function getCurrentDateStr() {
    let nowDate = new Date();
    let year = nowDate.getFullYear();
    let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
    let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
    return `${year}-${month}-${day}`;
}

// 获取当前时间 timeObj
function getCurrentTimeObj() {
    let nowDate = new Date();
    let year = nowDate.getFullYear();
    let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
    let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
    let hour = nowDate.getHours();
    let minute = nowDate.getMinutes();
    let second = nowDate.getSeconds();
    let timeObj = {
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second
    }
    return timeObj;
}

module.exports = {
    getCurrentTimeStr,
    getCurrentDateStr,
    getCurrentTimeObj
}
