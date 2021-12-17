<template>
    <Header></Header>
    <Mainer>
        <template v-slot:main>
            <!-- 面包屑导航 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统首页</el-breadcrumb-item>
                <el-breadcrumb-item>文章管理</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 内容区域 -->
            <div class="article-content">
                <div class="head">
                    <div class="head-wrapper">
                        <div class="head-title">
                            <el-breadcrumb separator-class="el-icon-arrow-right">
                                <el-breadcrumb-item to="/article" replace>文章列表</el-breadcrumb-item>
                                <el-breadcrumb-item>文章详情</el-breadcrumb-item>
                            </el-breadcrumb>
                        </div>
                    </div>
                </div>
                <div class="body">
                    <div class="form-box" v-html="article.content"></div>
                </div>
            </div>
        </template>
    </Mainer>
    <Footer></Footer>
</template>

<script>
import Header from '../../../components/Header.vue'
import Footer from '../../../components/Footer.vue'
import Mainer from '../../../components/Mainer.vue'
import {ajax} from '../../../axios/index.js'

export default {
    name: "ArticleDetail",
    components: {Header, Footer, Mainer},
    data() {
        return {
            article: {}
        }
    },
    created() {
        this.getArticleDetailById()
    },
    methods: {
        // 通过id获取文章详情
        getArticleDetailById() {
            ajax(
                'manager/article/article_detail/' + this.$route.params.id
            ).then(response => {
                console.log(response)
                if (response.data.successful) {
                    this.article = response.data.data
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                this.$message.error('网络请求出现错误')
            })
        }
    }
}
</script>

<style lang="less" scoped>
.article-content {
    background-color: #FFFFFF;
    margin: 9px 9px 0 9px;

    .head {
        box-sizing: border-box;
        min-height: 48px;
        padding: 0 24px;
        font-weight: 500;
        font-size: 16px;
        border-bottom: 1px solid #F0F0F0;

        .head-wrapper {
            display: flex;
            align-items: center;

            .head-title {
                flex: 1;
                display: inline-block;
                padding: 16px 0;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .head-extra {
                float: right;
                margin-left: auto;
                padding: 16px 0;
                font-size: 14px;
            }
        }
    }

    .body {
        padding: 24px;
        background-color: #FFFFFF;

        .form-box {
            width: 870px;
            margin: 0 auto;
        }
    }
}
</style>