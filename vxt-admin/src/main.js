import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
// 引入路由对象
import router from './router/index'
// 引入vuex
import store from './store/index.js'
// 导入全局样式表
import './assets/css/global.css'
// 引入阿里字体图标
import './assets/fonts/iconfont.css'

// 创建App实例
const app = createApp(App)

// 使用路由
app.use(router)
// 使用vuex
app.use(store)
// 使用element组件
app.use(ElementPlus)

// 挂载实例
app.mount('#app')
