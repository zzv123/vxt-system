<template>
    <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '56px' : '200px'">
            <div class="aside-logo">
                <div class="logo-title" v-show="!isCollapse">
                    <span>后台管理系统</span>
                </div>
                <div class="logo-img" v-show="isCollapse">
                    <img :src="logoURL">
                </div>
            </div>
            <el-menu :default-active="activeRouter" unique-opened router :collapse="isCollapse"
                     :collapse-transition="false" @select="selectMenu"
                     background-color="#001529" text-color="#a6adb4" active-text-color="#FFFFFF"
                     class="el-menu-vertical-demo">
                <el-menu-item index="/overview">
                    <i class="iconfont icon-overview"></i>
                    <span v-show="!isCollapse">&nbsp;数据概览</span>
                </el-menu-item>
                <el-menu-item index="/ad_course">
                    <i class="iconfont icon-jiaodiantu"></i>
                    <span v-show="!isCollapse">&nbsp;焦点课程</span>
                </el-menu-item>
                <el-menu-item index="/category">
                    <i class="iconfont icon-fenlei"></i>
                    <span v-show="!isCollapse">&nbsp;分类管理</span>
                </el-menu-item>
                <el-menu-item index="/teacher">
                    <i class="iconfont icon-teacher"></i>
                    <span v-show="!isCollapse">&nbsp;讲师管理</span>
                </el-menu-item>
                <el-menu-item index="/course">
                    <i class="iconfont icon-course"></i>
                    <span v-show="!isCollapse">&nbsp;课程管理</span>
                </el-menu-item>
                <el-menu-item index="/article">
                    <i class="iconfont icon-article"></i>
                    <span v-show="!isCollapse">&nbsp;文章管理</span>
                </el-menu-item>
                <el-sub-menu>
                    <template #title>
                        <i class="iconfont icon-shujutongji"></i>&nbsp;
                        <span v-show="!isCollapse">&nbsp;数据统计</span>
                    </template>
                    <el-menu-item index="/course_chart">
                        <i class="iconfont icon-zhuzhuangtu"></i>
                        <span>&nbsp;课程统计</span>
                    </el-menu-item>
                    <el-menu-item index="/user_chart">
                        <i class="iconfont icon-zhexiantu"></i>
                        <span>&nbsp;用户统计</span>
                    </el-menu-item>
                    <el-menu-item index="/comment_chart">
                        <i class="iconfont icon-bingtu"></i>
                        <span>&nbsp;评论统计</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-menu-item index="/setting">
                    <i class="iconfont icon-setting"></i>
                    <span v-show="!isCollapse">&nbsp;网站配置</span>
                </el-menu-item>
            </el-menu>
            <!-- 切换菜单的折叠和显示 -->
            <div class="toggle-button" @click="isCollapse = !isCollapse"
                 :style="isCollapse ? 'width:56px' : 'width:200px'">
                <el-icon v-show="isCollapse">
                    <expand></expand>
                </el-icon>
                <el-icon v-show="!isCollapse">
                    <fold></fold>
                </el-icon>
            </div>
        </el-aside>
        <!-- 主体 -->
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
import {Fold, Expand} from '@element-plus/icons'
import logoURL from '../assets/imgs/login_logo.png'

export default {
    name: "Home",
    components: {Fold, Expand},
    data() {
        return {
            logoURL,
            isCollapse: false, // 是否折叠菜单
            activeRouter: '/overview'
        }
    },
    mounted() {
        this.activeRouter = window.sessionStorage.getItem("activeRouter") === null ? '/overview' : window.sessionStorage.getItem("activeRouter")
    },
    updated() {
        this.activeRouter = window.sessionStorage.getItem("activeRouter") === null ? '/overview' : window.sessionStorage.getItem("activeRouter")
    },
    methods: {
        selectMenu(index) {
            this.activeRouter = index
            window.sessionStorage.setItem("activeRouter", index)
        }
    }
}
</script>

<style lang="less" scoped>
.el-container {
    height: 100%;

    .el-aside {
        background-color: #001529;

        .aside-logo {
            .logo-title {
                height: 32px;
                margin: 16px;
                background: rgba(255, 255, 255, 0.3);
                line-height: 32px;
                text-align: center;
                color: #FFFFFF;
                font-size: 16px;
                font-weight: bold;
                overflow: hidden;
            }
            .logo-img {
                width: 100%;
                height: 64px;
                position: relative;
                img {
                    width: 40px;
                    height: 40px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                }
            }
        }

        .el-menu {
            border-right: none;

            .el-menu-item:hover {
                color: #FFFFFF;
            }

            .el-menu-item.is-active {
                background-color: #1890FF !important;
                color: #FFFFFF;
            }
        }

        .toggle-button {
            text-align: center;
            height: 48px;
            background-color: #002140;
            line-height: 48px;
            color: #FFFFFF;
            cursor: pointer;
            position: fixed;
            bottom: 0;
        }
    }

    .el-main {
        background: #f0f2f5;
        padding: 0;
    }
}
</style>
