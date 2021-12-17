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
        component: () => import('../views/Login.vue')
    },
    {
        path: '/home',
        component: () => import('../views/Home.vue'),
        redirect: '/overview',
        children: [
            {
                path: "/:pathMatch(.*)",
                redirect: '/404'
            },
            {path: '/overview', component: () => import('../views/overView/OverView.vue')},
            {path: '/ad_course', component: () => import('../views/focusCourse/FocusCourse.vue')},
            {path: '/category', component: () => import('../views/category/Category.vue')},
            {path: '/teacher', component: () => import('../views/teacher/Teacher.vue')},
            {path: '/course', component: () => import('../views/course/Course.vue')},
            {path: '/course/add', component: () => import('../views/course/courseAdd/CourseAdd.vue')},
            {path: '/course/intro/:id', component: () => import('../views/course/courseIntro/CourseIntro.vue')},
            {path: '/course/edit/:id', component: () => import('../views/course/courseEdit/CourseEdit.vue')},
            {path: '/article', component: () => import('../views/article/Article.vue')},
            {path: '/article/add', component: () => import('../views/article/articleAdd/ArticleAdd.vue')},
            {path: '/article/detail/:id', component: () => import('../views/article/articleDetail/ArticleDetail.vue')},
            {path: '/article/edit/:id', component: () => import('../views/article/articleEdit/ArticleEdit.vue')},
            {path: '/course_chart', component: () => import('../views/statistics/CourseChart.vue')},
            {path: '/user_chart', component: () => import('../views/statistics/UserChart.vue')},
            {path: '/comment_chart', component: () => import('../views/statistics/CommentChart.vue')},
            {path: '/setting', component: () => import('../views/setting/Setting.vue')},
            {path: '/403', component: () => import('../views/exception/403.vue')},
            {path: '/404', component: () => import('../views/exception/404.vue')},
            {path: '/500', component: () => import('../views/exception/500.vue')}
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(), // hash模式
    routes: routers,
    linkActiveClass: 'current'
})

// 3.导出路由对象
export default router