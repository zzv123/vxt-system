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
                                <el-breadcrumb-item>新增文章</el-breadcrumb-item>
                            </el-breadcrumb>
                        </div>
                        <div class="head-extra">
                            <el-button type="success" @click="submitAddArticle">保存</el-button>
                        </div>
                    </div>
                </div>
                <div class="body">
                    <div class="form-box">
                        <el-form :model="addFrom" :rules="rules" label-position="right" label-width="80px">
                            <el-form-item label="文章标题" prop="title">
                                <el-input v-model="addFrom.title" placeholder="请填写文章标题"></el-input>
                            </el-form-item>
                            <el-form-item label="文章简介" prop="intro">
                                <el-input type="textarea" :rows="2" v-model="addFrom.intro"
                                          placeholder="请填写文章简介"></el-input>
                            </el-form-item>
                            <el-form-item label="文章内容" prop="content">
                                <TEditor v-model="addFrom.content"/>
                            </el-form-item>
                        </el-form>
                    </div>
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
import TEditor from '../../../components/TEditor.vue'

export default {
    name: "ArticleAdd",
    components: {Header, Footer, Mainer, TEditor},
    data() {
        return {
            addFrom: {
                title: '',
                intro: '',
                content: ''
            },
            rules: {
                title: [{required: true}],
                intro: [{required: true}],
                content: [{required: true}]
            }
        }
    },
    methods: {
        // 保存新增文章
        submitAddArticle() {
            ajax(
                'manager/article/article_add',
                {
                    title: this.addFrom.title,
                    intro: this.addFrom.intro,
                    content: this.addFrom.content
                },
                'POST'
            ).then(response => {
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.$router.push('/article')
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