<template>
    <Header></Header>
    <Mainer>
        <template v-slot:main>
            <!-- 面包屑导航 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统首页</el-breadcrumb-item>
                <el-breadcrumb-item>数据概览</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 数据统计 -->
            <el-row :gutter="10">
                <!--用户概览-->
                <el-col :span="6">
                    <div class="statistics" style="background: linear-gradient(-125deg, #57bdbf, #2f9de2);">
                        <div class="title">
                            <p>用户概览</p>
                        </div>
                        <div class="num">{{ userTotal }}</div>
                        <div class="tip">当前用户总人数</div>
                        <i class="iconfont icon-user"></i>
                    </div>
                </el-col>
                <!--讲师概览-->
                <el-col :span="6">
                    <div class="statistics" style="background: linear-gradient(-125deg, #ff7d7d, #fb2c95);">
                        <div class="title">
                            <p>讲师概览</p>
                        </div>
                        <div class="num">{{ teacherTotal }}</div>
                        <div class="tip">当前讲师总人数</div>
                        <i class="iconfont icon-teacher"></i>
                    </div>
                </el-col>
                <!--课程概览-->
                <el-col :span="6">
                    <div class="statistics" style="background: linear-gradient(-113deg, #c543d8, #925cc3);">
                        <div class="title">
                            <p>课程概览</p>
                        </div>
                        <div class="num">{{ courseTotal }}</div>
                        <div class="tip">当前课程总门数</div>
                        <i class="iconfont icon-course"></i>
                    </div>
                </el-col>
                <!--文章概览-->
                <el-col :span="6">
                    <div class="statistics" style="background: linear-gradient(-141deg, #ecca1b, #f39526);">
                        <div class="title">
                            <p>文章概览</p>
                        </div>
                        <div class="num">{{ articleTotal }}</div>
                        <div class="tip">当前文章总篇数</div>
                        <i class="iconfont icon-article"></i>
                    </div>
                </el-col>
            </el-row>
            <!-- 评论统计 -->
            <div class="comments-statistics">
                <el-tabs v-model="activeName" @tab-click="getComments">
                    <el-tab-pane label="5分评论" name="5">
                        <div class="comments-box">
                            <el-empty description="还没有评论数据呀" v-show="comments.length === 0"></el-empty>
                            <div class="comment-item-box" v-for="item in comments" v-bind:key="item.comment_id">
                                <el-avatar size="76" :src="baseURL + item.user_header"></el-avatar>
                                <div class="comment-info-box">
                                    <div class="comment-user">
                                        <span class="name">{{ item.user_name }}</span>
                                        <span class="time">{{ item.comment_time }}</span>
                                    </div>
                                    <div class="comment-detail">
                                        <span class="content">{{ item.comment_content }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="4分评论" name="4">
                        <div class="comments-box">
                            <el-empty description="还没有评论数据呀" v-show="comments.length === 0"></el-empty>
                            <div class="comment-item-box" v-for="item in comments" v-bind:key="item.comment_id">
                                <el-avatar size="76" :src="baseURL + item.user_header"></el-avatar>
                                <div class="comment-info-box">
                                    <div class="comment-user">
                                        <span class="name">{{ item.user_name }}</span>
                                        <span class="time">{{ item.comment_time }}</span>
                                    </div>
                                    <div class="comment-detail">
                                        <span class="content">{{ item.comment_content }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="3分评论" name="3">
                        <div class="comments-box">
                            <el-empty description="还没有评论数据呀" v-show="comments.length === 0"></el-empty>
                            <div class="comment-item-box" v-for="item in comments" v-bind:key="item.comment_id">
                                <el-avatar size="76" :src="baseURL + item.user_header"></el-avatar>
                                <div class="comment-info-box">
                                    <div class="comment-user">
                                        <span class="name">{{ item.user_name }}</span>
                                        <span class="time">{{ item.comment_time }}</span>
                                    </div>
                                    <div class="comment-detail">
                                        <span class="content">{{ item.comment_content }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="2分评论" name="2">
                        <div class="comments-box">
                            <el-empty description="还没有评论数据呀" v-show="comments.length === 0"></el-empty>
                            <div class="comment-item-box" v-for="item in comments" v-bind:key="item.comment_id">
                                <el-avatar size="76" :src="baseURL + item.user_header"></el-avatar>
                                <div class="comment-info-box">
                                    <div class="comment-user">
                                        <span class="name">{{ item.user_name }}</span>
                                        <span class="time">{{ item.comment_time }}</span>
                                    </div>
                                    <div class="comment-detail">
                                        <span class="content">{{ item.comment_content }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="1分评论" name="1">
                        <div class="comments-box">
                            <el-empty description="还没有评论数据呀" v-show="comments.length === 0"></el-empty>
                            <div class="comment-item-box" v-for="item in comments" v-bind:key="item.comment_id">
                                <el-avatar size="76" :src="baseURL + item.user_header"></el-avatar>
                                <div class="comment-info-box">
                                    <div class="comment-user">
                                        <span class="name">{{ item.user_name }}</span>
                                        <span class="time">{{ item.comment_time }}</span>
                                    </div>
                                    <div class="comment-detail">
                                        <span class="content">{{ item.comment_content }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </template>
    </Mainer>
    <Footer></Footer>
</template>

<script>
import Header from '../../components/Header.vue'
import Mainer from '../../components/Mainer.vue'
import Footer from '../../components/Footer.vue'
import {baseURL, ajax} from '../../axios/index.js'

export default {
    name: "OverView",
    components: {
        Header,
        Mainer,
        Footer
    },
    data() {
        return {
            activeName: '5',
            comments: [],
            userTotal: 0,
            teacherTotal: 0,
            courseTotal: 0,
            articleTotal: 0,
            baseURL
        }
    },
    created() {
        this.getAllStatistics()
        this.getComments()
    },
    methods: {
        // 获取所有统计信息
        getAllStatistics() {
            Promise.all([
                ajax(
                    'manager/over_view/ov_user'
                ),
                ajax(
                    'manager/over_view/ov_teacher'
                ),
                ajax(
                    'manager/over_view/ov_course'
                ),
                ajax(
                    'manager/over_view/ov_article'
                )
            ]).then(response => {
                console.log(response)
                this.userTotal = response[0].data.data.total
                this.teacherTotal = response[1].data.data.total
                this.courseTotal = response[2].data.data.total
                this.articleTotal = response[3].data.data.total
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 获取评论信息
        getComments() {
            ajax(
                'manager/over_view/ov_comment',
                {
                    score: this.activeName
                }
            ).then(response => {
                console.log(response)
                if (response.data.successful) {
                    this.comments = response.data.data
                } else {
                    this.$message.error(response.data.msg)
                    this.comments = []
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
.el-row {
    padding: 0 9px;

    .statistics {
        color: white;
        height: 150px;
        padding: 12px 22px;
        position: relative;

        .title {
            display: flex;
            justify-content: space-between;
            align-items: center;

            p {
                font-size: 13px;
                font-weight: bold;
            }

        }

        .num {
            font-size: 46px;
            text-align: left;
        }

        .tip {
            font-size: 12px;
        }

        .iconfont {
            font-size: 70px;
            position: absolute;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0.2;
        }
    }
}

.comments-statistics {
    height: 350px;
    background-color: #fff;
    margin: 9px 9px 0 9px;
    padding: 0 20px;

    .comments-box {
        .comment-item-box {
            height: 76px;
            display: flex;
            align-items: center;

            .comment-info-box {
                height: 40px;
                width: 100%;
                margin-left: 10px;

                .comment-user {
                    height: 18px;
                    line-height: 18px;
                    font-size: 12px;

                    .name {
                        color: rgba(0, 0, 0, 0.45);
                    }

                    .time {
                        color: #cccccc;
                        margin-left: 10px;
                    }
                }

                .comment-detail {
                    font-size: 14px;
                    height: 22px;
                    line-height: 22px;
                }
            }
        }
    }
}
</style>