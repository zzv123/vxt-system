// 1.引入
import {createRouter, createWebHashHistory} from 'vue-router'

// 2.创建路由对象
const routers = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: () => import('../views/Login.vue'),
        meta: {title: '系统登录'}
    },
    {
        path: '/home',
        component: () => import('../views/Home.vue'),
        meta: {title: '系统首页'},
        redirect: '/overview',
        children: [
            {
                path: "/:pathMatch(.*)",
                redirect: '/404'
            },
            {path: '/overview', meta: {title: '数据概览'}, component: () => import('../views/overView/OverView.vue')},
            {path: '/ad_course', meta: {title: '焦点课程'}, component: () => import('../views/focusCourse/FocusCourse.vue')},
            {path: '/category', meta: {title: '分类管理'}, component: () => import('../views/category/Category.vue')},
            {path: '/teacher', meta: {title: '讲师管理'}, component: () => import('../views/teacher/Teacher.vue')},
            {path: '/course', meta: {title: '课程管理'}, component: () => import('../views/course/Course.vue')},
            {path: '/course/add', meta: {title: '新增课程'}, component: () => import('../views/course/courseAdd/CourseAdd.vue')},
            {path: '/course/intro/:id', meta: {title: '课程介绍'}, component: () => import('../views/course/courseIntro/CourseIntro.vue')},
            {path: '/course/edit/:id', meta: {title: '编辑课程'}, component: () => import('../views/course/courseEdit/CourseEdit.vue')},
            {path: '/article', meta: {title: '文章管理'}, component: () => import('../views/article/Article.vue')},
            {path: '/article/add', meta: {title: '新增文章'}, component: () => import('../views/article/articleAdd/ArticleAdd.vue')},
            {path: '/article/detail/:id', meta: {title: '文章详情'}, component: () => import('../views/article/articleDetail/ArticleDetail.vue')},
            {path: '/article/edit/:id', meta: {title: '编辑文章'}, component: () => import('../views/article/articleEdit/ArticleEdit.vue')},
            {path: '/course_chart', meta: {title: '课程统计'}, component: () => import('../views/statistics/CourseChart.vue')},
            {path: '/user_chart', meta: {title: '用户统计'}, component: () => import('../views/statistics/UserChart.vue')},
            {path: '/comment_chart', meta: {title: '评论统计'}, component: () => import('../views/statistics/CommentChart.vue')},
            {path: '/setting', meta: {title: '网站配置'}, component: () => import('../views/setting/Setting.vue')},
            {path: '/403', meta: {title: '403 Forbidden'}, component: () => import('../views/exception/403.vue')},
            {path: '/404', meta: {title: '404 Not Found'}, component: () => import('../views/exception/404.vue')},
            {path: '/500', meta: {title: '500 Internal Server Error'}, component: () => import('../views/exception/500.vue')}
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(), // hash模式
    routes: routers,
    linkActiveClass: 'current'
})

// 全局路由的前置守卫
router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title
    }
    // 如果访问登陆页，则放行
    if (to.path === '/login') {
        return next()
    }
    // 如果用户未登陆，则跳转到/login
    const token = window.localStorage.getItem("token")
    if (!token) {
        alert('禁止访问，请先登录！')
        return next('/login')
    }
    // 如果用户已登录，则放行
    next()
})

// 3.导出路由对象
export default router