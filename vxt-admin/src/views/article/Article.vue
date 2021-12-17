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
                        <div class="head-title">文章列表</div>
                        <div class="head-extra">
                            <el-button type="success" @click="$router.push('/article/add')">新增</el-button>
                        </div>
                    </div>
                </div>
                <div class="body">
                    <el-table :data="showTable" border
                              :header-cell-style="{background: '#fafafa',height: '55px',color: 'black'}"
                              :cell-style="{height: '65px'}">
                        <el-table-column align="center" prop="id" label="ID" width="100"/>
                        <el-table-column align="center" prop="title" label="文章标题"/>
                        <el-table-column align="center" label="文章时间" :formatter="timeFormat"/>
                        <el-table-column align="center" prop="intro" label="文章简介"/>
                        <el-table-column align="center" label="操作" width="280px">
                            <template #default="scope">
                                <el-button size="mini" @click="articleDetail(scope.$index)"
                                >详情
                                </el-button
                                >
                                <el-button size="mini" @click="editArticle(scope.$index)"
                                >编辑
                                </el-button
                                >
                                <el-popconfirm title="是否确认要删除这个文章？" confirm-button-text="确认" cancel-button-text="取消"
                                               @confirm="submitDeleteArticle(scope.$index)">
                                    <template #reference>
                                        <el-button size="mini" type="danger">删除</el-button>
                                    </template>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination background layout="prev, pager, next" :total="this.articles.length"
                                   :page-size="pageSize" @current-change="handleCurrentChange"></el-pagination>
                </div>
            </div>
        </template>
    </Mainer>
    <Footer></Footer>
</template>

<script>
import Header from '../../components/Header.vue'
import Footer from '../../components/Footer.vue'
import Mainer from '../../components/Mainer.vue'
import {ajax} from '../../axios/index.js'
import * as moment from 'moment'

export default {
    name: "Article",
    components: {Header, Footer, Mainer},
    data() {
        return {
            articles: [], // 文章列表
            currentPage: 1, // 当前页码
            pageSize: 5, // 页码尺寸
        }
    },
    computed: {
        showTable() {
            return this.articles.slice(
                (this.currentPage - 1) * this.pageSize,
                this.currentPage * this.pageSize
            )
        }
    },
    created() {
        this.getArticles()
    },
    methods: {
        // 获取文章列表
        getArticles() {
            ajax(
                'manager/article/article_list'
            ).then(response => {
                console.log(response)
                if (response.data.successful) {
                    this.articles = response.data.data
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                this.$message.error('网络请求出现错误')
            })
        },
        // 时间转换
        timeFormat(row) {
            return moment(row.create_time).format('YYYY-MM-DD HH:MM:SS')
        },
        //设置当前页为点击页
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage
        },
        // 跳转编辑页面
        editArticle(index) {
            this.$router.push({
                path: '/article/edit/' + this.showTable[index].id
            })
        },
        // 跳转文章详情
        articleDetail(index) {
            this.$router.push({
                path: '/article/detail/' + this.showTable[index].id
            })
        },
        // 提交删除文章
        submitDeleteArticle(index) {
            ajax(
                'manager/article/article_delete',
                {
                    id: this.showTable[index].id
                }
            ).then(response => {
                console.log(response.data)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.getArticles()
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
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

        .el-table {
            margin-top: 0;
            font-size: 14px;
        }
    }
}
</style>