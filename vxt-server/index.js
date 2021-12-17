// 引入express框架
const express = require("express");
// 引入path模块
const path = require('path');
// 引入配置文件
const config = require('./config/config');
// 引入自定义中间件
const {rizhiMF, notFoundMF, handlerErrorMF, crossDomainM, toolM} = require("./middleware/middleware");
// 引入时间处理工具函数
const {getCurrentDate} = require("./utils/dateTime");
// 引入前台路由
const c_homeRouter = require("./router/client/homeRouter");
const c_teacherRouter = require("./router/client/teacherRouter");
const c_courseRouter = require("./router/client/courseRouter");
const c_articleRouter = require("./router/client/articleRouter");
const c_searchRouter = require("./router/client/searchRouter");
const c_userRouter = require("./router/client/userRouter");
// 引入后台路由
const m_adCourseRouter = require("./router/manager/adCourseRouter");
const m_adminRouter = require("./router/manager/adminRouter");
const m_articleRouter = require("./router/manager/articleRouter");
const m_categoryRouter = require("./router/manager/categoryRouter");
const m_configRouter = require("./router/manager/configRouter");
const m_courseRouter = require("./router/manager/courseRouter");
const m_overViewRouter = require("./router/manager/overViewRouter");
const m_statisticsRouter = require("./router/manager/statisticsRouter");
const m_teacherRouter = require("./router/manager/teacherRouter");


// 实例化app对象
let app = express();

// 跨域中间件
app.use(crossDomainM);
// 工具中间件
app.use(toolM);
// JSON处理中间件
app.use(express.json(), express.urlencoded({extended: true}));
// 日志中间件
app.use(rizhiMF(path.resolve(__dirname, `./logs/info/${getCurrentDate()}.txt`)));
// 静态资源服务
app.use(express.static(path.resolve(__dirname, "public")));
app.use('/', express.static(path.join(__dirname, '/apidoc')));

// 使用前台路由
app.use("/api/client/home", c_homeRouter);
app.use("/api/client/teacher", c_teacherRouter);
app.use("/api/client/course", c_courseRouter);
app.use("/api/client/article", c_articleRouter);
app.use("/api/client/search", c_searchRouter);
app.use("/api/client/user", c_userRouter);
// 使用后台路由
app.use("/api/manager/ad_course", m_adCourseRouter);
app.use("/api/manager/admin", m_adminRouter);
app.use("/api/manager/article", m_articleRouter);
app.use("/api/manager/category", m_categoryRouter);
app.use("/api/manager/config", m_configRouter);
app.use("/api/manager/course", m_courseRouter);
app.use("/api/manager/over_view", m_overViewRouter);
app.use("/api/manager/statistics", m_statisticsRouter);
app.use("/api/manager/teacher", m_teacherRouter);

// 404中间件
app.use(notFoundMF(path.resolve(__dirname, "./pages/404.html")));
// 错误处理中间件
app.use(handlerErrorMF(path.resolve(__dirname, `./logs/error/${getCurrentDate()}.txt`), path.resolve(__dirname, "./pages/500.html")));
// 启动应用服务器
const version = config.Version //版本号
const port = config.Port //端口
app.listen(port, function () {
    console.log(`Node服务启动成功，版本号:${version}，服务器地址http://localhost:${port}/`);
})
