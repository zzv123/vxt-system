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
                                <el-breadcrumb-item>编辑文章</el-breadcrumb-item>
                            </el-breadcrumb>
                        </div>
                        <div class="head-extra">
                            <el-button type="success" @click="submitEditArticle">保存</el-button>
                        </div>
                    </div>
                </div>
                <div class="body">
                    <div class="form-box">
                        <el-form :model="editForm" :rules="rules" label-position="right" label-width="80px">
                            <el-form-item label="文章ID" prop="id">
                                <el-input v-model="editForm.id" placeholder="请填写文章ID" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="文章标题" prop="title">
                                <el-input v-model="editForm.title" placeholder="请填写文章标题"></el-input>
                            </el-form-item>
                            <el-form-item label="文章简介" prop="intro">
                                <el-input type="textarea" :rows="2" v-model="editForm.intro"
                                          placeholder="请填写文章简介"></el-input>
                            </el-form-item>
                            <el-form-item label="文章内容" prop="content">
                                <TEditor v-if="editForm.content" v-model="editForm.content"/>
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
    name: "ArticleEdit",
    components: {Header, Footer, Mainer, TEditor},
    data() {
        return {
            editForm: {
                id: '',
                title: '',
                intro: '',
                content: ''
            },
            rules: {
                id: [{required: true}],
                title: [{required: true}],
                intro: [{required: true}],
                content: [{required: true}]
            }
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
                    this.editForm.id = response.data.data.id
                    this.editForm.title = response.data.data.title
                    this.editForm.intro = response.data.data.intro
                    this.editForm.content = response.data.data.content
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                this.$message.error('网络请求出现错误')
            })
        },
        // 保存编辑文章
        submitEditArticle() {
            ajax(
                'manager/article/article_update',
                {
                    id: this.editForm.id,
                    title: this.editForm.title,
                    intro: this.editForm.intro,
                    content: this.editForm.content
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