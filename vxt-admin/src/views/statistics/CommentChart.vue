<template>
    <Header></Header>
    <Mainer>
        <template v-slot:main>
            <!-- 面包屑导航 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统首页</el-breadcrumb-item>
                <el-breadcrumb-item>数据统计</el-breadcrumb-item>
                <el-breadcrumb-item>评论统计</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 内容区域 -->
            <div class="chart-content">
                <div class="head">
                    <div class="head-wrapper">
                        <div class="head-title">分数分布统计</div>
                    </div>
                </div>
                <div class="body">
                    <div class="chart-box" id="chart" v-if="commentScore.length > 0"></div>
                    <el-empty description="暂无数据" v-else></el-empty>
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
import * as echarts from 'echarts'
import {ajax} from '../../axios/index.js'
export default {
    name: "CommentChart",
    components: {Header, Footer, Mainer},
    data() {
        return {
            commentScore: []
        }
    },
    created() {
        this.getCommentScore()
    },
    methods: {
        async getCommentScore() {
            await ajax(
                'manager/statistics/comment_score_count'
            ).then(response => {
                console.log(response)
                if (response.data.successful) {
                    this.commentScore = response.data.data
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                this.$message.error('网络请求出现错误')
            })
            this.initChart()
        },
        initChart() {
            // 创建echarts实例
            const chart = echarts.init(document.getElementById('chart'))
            const dataArr = this.commentScore.map(item=>({value: item.score_count, name: item.score+"分"}))
            const option = {
                legend: {
                    top: 'bottom'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                series: [
                    {
                        name: '面积模式',
                        type: 'pie',
                        radius: [50, 100],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 8
                        },
                        data: dataArr
                    }
                ]
            }
            chart.setOption(option)
        }
    }
}
</script>

<style lang="less" scoped>
.chart-content {
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
        }
    }

    .body {
        padding: 24px;
        background-color: #FFFFFF;
        height: 348px;
        .chart-box {
            width: 1190px;
            height: 300px;
            margin: 0 auto;
        }
    }
}
</style>