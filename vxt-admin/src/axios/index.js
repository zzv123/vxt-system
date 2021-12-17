// 导入NProgress进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 导入axios
import axios from 'axios'

export const baseURL = "http://localhost:5555"

// axios全局配置
axios.defaults.baseURL = baseURL + "/api"//基础请求路径
axios.defaults.timeout = 5000 //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded' //默认请求头

// axios配置拦截
// 请求拦截
axios.interceptors.request.use((request) => {
    // 请求时开启进度条
    NProgress.start()
    return request
}, (error) => {
    return Promise.error(error)
})
// 响应拦截
axios.interceptors.response.use((response) => {
    // 响应时结束进度度
    NProgress.done()
    return response
}, (error) => {
    return Promise.error(error)
})

export function ajax(url = '', params = {}, type = 'GET') {
    return new Promise((resolve, reject) => {
        // 0.定义全局变量
        let promise
        // 1.判断请求的类型
        if (type.toUpperCase() === 'GET') {
            promise = axios({
                method: 'get',
                url: url,
                params: params
            })
        } else if (type.toUpperCase() === 'POST') {
            promise = axios({
                method: 'post',
                url: url,
                data: params
            })
        }
        // 3.处理返回
        promise.then((response) => {
            resolve(response)
        }).catch((error) => {
            reject(error)
        })
    })
}