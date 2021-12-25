/* 配置文件 */
// const baseURL = 'http://localhost:5050' //V学堂-前台接口(本地回环地址)
const baseURL = 'http://192.168.0.118:5050' //V学堂-前台接口(本地IP地址)

module.exports = {
	/* 项目配置 */
	baseURL: baseURL,
	version: '1.0.20211220.1', //版本号
	/* 文章接口 */
	article_list: baseURL + '/api/client/article/article_list', //前台获取文章列表
	article_detail: baseURL + '/api/client/article/article_detail', //前台获取文章详情
	/* 课程接口 */
	course_category: baseURL + '/api/client/course/course_category', //前台获取课程分类
	course_list: baseURL + '/api/client/course/course_list', //前台获取课程列表
	course_basic: baseURL + '/api/client/course/course_basic', //前台获取课程基本信息
	course_outline: baseURL + '/api/client/course/course_outline', //前台获取课程大纲
	course_comment: baseURL + '/api/client/course/course_comment', //前台获取课程评论
	/* 首页接口 */
	nav_menu: baseURL + '/api/client/home/nav_menu', //前台获取导航菜单
	star_teacher: baseURL + '/api/client/home/star_teacher', //前台获取明星讲师
	last_news: baseURL + '/api/client/home/last_news', //前台获取最新文章
	hot_course: baseURL + '/api/client/home/hot_course', //前台获取热门好课
	focus_img: baseURL + '/api/client/home/focus_img', //前台获取焦点图课程信息
	web_config: baseURL + '/api/client/home/web_config', //前台获取配置信息
	/* 搜索接口 */
	search_all: baseURL + '/api/client/search/search_all', //前台搜索全部
	search_article: baseURL + '/api/client/search/search_article', //前台搜索文章
	search_teacher: baseURL + '/api/client/search/search_teacher', //前台搜索讲师
	search_course: baseURL + '/api/client/search/search_course', //前台搜索课程
	/* 讲师接口 */
	teacher_list: baseURL + '/api/client/teacher/teacher_list', //前台获取讲师列表
	teacher_detail: baseURL + '/api/client/teacher/teacher_detail', //前台获取讲师详情
	/* 用户接口 */
	update_study_history: baseURL + '/api/client/user/update_study_history', //前台学习历史记录新增/更新
	update_password: baseURL + '/api/client/user/update_password', //前台用户修改密码
	update_info: baseURL + '/api/client/user/update_info', //前台用户基本信息更新
	update_header: baseURL + '/api/client/user/update_header', //前台用户头像上传
	user_register: baseURL + '/api/client/user/user_register', //前台用户注册
	user_login: baseURL + '/api/client/user/user_login', //前台用户登录
	study_history: baseURL + '/api/client/user/study_history', //前台获取学习历史记录
}
