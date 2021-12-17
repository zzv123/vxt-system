// 1.引入
import {createStore} from 'vuex'

// 2.创建一个store对象
const store = createStore({
    // 非生产环境启用严格模式
    strict: process.env.NODE_ENV !== 'production',
    // 全局共享的状态存放
    state: {},
    // 相当于计算属性
    getters: {},
    // 同步提交状态
    mutations: {},
    // 提交操作（可以是同步也可以是异步）给mutations
    actions: {},
    // 模块
    modules: {}
})

// 3.导出
export default store