<template>
    <Header></Header>
    <Mainer>
        <template v-slot:main>
            <!-- 面包屑导航 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统首页</el-breadcrumb-item>
                <el-breadcrumb-item>数据统计</el-breadcrumb-item>
                <el-breadcrumb-item>课程统计</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 内容区域 -->
            <div class="chart-content">
                <div class="head">
                    <div class="head-wrapper">
                        <div class="head-title">学科课程统计</div>
                    </div>
                </div>
                <div class="body">
                    <div class="chart-box" id="chart" v-if="categoryCourse.length > 0"></div>
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
    name: "CourseChart",
    components: {Header, Footer, Mainer},
    data() {
        return {
            categoryCourse: []
        }
    },
    created() {
        this.getCategoryCourse()
    },
    methods: {
        async getCategoryCourse() {
            await ajax(
                'manager/statistics/category_course_count'
            ).then(response => {
                console.log(response)
                if (response.data.successful) {
                    this.categoryCourse = response.data.data
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
            const xDataArr = this.categoryCourse.map(item=>item.category_name)
            const yDataArr = this.categoryCourse.map(item=>item.course_count)
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                    }
                },
                xAxis: {
                    type: 'category',
                    data: xDataArr
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        type: 'bar',
                        data: yDataArr,
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(180, 180, 180, 0.2)'
                        }
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