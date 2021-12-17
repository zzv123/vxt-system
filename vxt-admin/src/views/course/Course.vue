<template>
    <Header></Header>
    <Mainer>
        <template v-slot:main>
            <!-- 面包屑导航 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统首页</el-breadcrumb-item>
                <el-breadcrumb-item>课程管理</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 内容区域 -->
            <div class="article-content">
                <div class="head">
                    <div class="head-wrapper">
                        <div class="head-title">课程列表</div>
                        <div class="head-extra">
                            <el-button type="success" @click="$router.push('/course/add')">新增</el-button>
                        </div>
                    </div>
                </div>
                <div class="body">
                    <el-table :data="showTable" fit
                              :header-cell-style="{background: '#fafafa',height: '55px',color: 'black'}"
                              :cell-style="{height: '97px'}">
                        <el-table-column align="center" prop="id" label="ID" width="80"/>
                        <el-table-column align="center" prop="title" label="课程名称" width="200"/>
                        <el-table-column align="center" label="课程封面" width="120">
                            <template #default="scope">
                                <el-avatar size="64" shape="square" :src="baseURL + scope.row.fm_url"></el-avatar>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="是否热门" width="100">
                            <template #default="scope">
                                <el-switch v-model="scope.row.is_hot" @change="isHotChange(scope.row)"
                                           inline-prompt :active-value="1" :inactive-value="0"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="所属老师" width="160">
                            <template #default="scope">
                                <el-select v-model="scope.row.teacher_id" placeholder="请选择所属老师" class="from-item"
                                           @change="ownTeachersChange(scope.row)">
                                    <el-option v-for="item in ownTeachers" :key="item.id" :label="item.name"
                                               :value="item.id"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="所属分类" width="160">
                            <template #default="scope">
                                <el-select v-model="scope.row.category_id" placeholder="请选择所属分类" class="from-item"
                                           @change="ownCategoriesChange(scope.row)">
                                    <el-option v-for="item in ownCategories" :key="item.id" :label="item.title"
                                               :value="item.id"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作">
                            <template #default="scope">
                                <el-button size="mini" @click="courseIntro(scope.$index)"
                                >介绍
                                </el-button
                                >
                                <el-button size="mini" @click="courseComment(scope.$index)"
                                >评论
                                </el-button
                                >
                                <el-button size="mini" @click="courseOutline(scope.$index)"
                                >大纲
                                </el-button
                                >
                                <el-button size="mini" @click="editCourse(scope.$index)"
                                >编辑
                                </el-button
                                >
                                <el-popconfirm title="是否确认要删除这个课程？" confirm-button-text="确认" cancel-button-text="取消"
                                               @confirm="submitDeleteCourse(scope.$index)">
                                    <template #reference>
                                        <el-button size="mini">删除</el-button>
                                    </template>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination background layout="prev, pager, next" :total="this.courses.length"
                                   :page-size="pageSize" @current-change="handleCurrentChange"></el-pagination>
                </div>
            </div>
            <!-- 评论抽屉 -->
            <el-drawer v-model="showLeftDrawer" direction="ltr" :title="drawerTitle + '>评论列表'" :size="400">
                <el-timeline>
                    <el-timeline-item v-for="(item, index) in comments" center :key="index" type="primary" hollow
                                      :timestamp="item.comment_time" :hide-timestamp="true">
                        <div style="height: 44px;display: flex;align-items: center">
                            <el-avatar size="64" :src="baseURL + item.user_header"></el-avatar>
                            &nbsp;
                            {{ item.comment_content }}
                        </div>
                    </el-timeline-item>
                </el-timeline>
            </el-drawer>
            <!-- 大纲抽屉 -->
            <el-drawer v-model="showRightDrawer" direction="rtl" :title="drawerTitle + '>课程大纲'" :size="600">
                <div class="outline_list" style="height: 25%;overflow-y: auto;">
                    <el-timeline>
                        <el-timeline-item v-for="(item, index) in outlines" center :key="index" type="primary" hollow>
                            <div style="height: 44px;display: flex;align-items: center">
                                <el-popconfirm title="您确定要删除本章节吗？" confirm-button-text="确认" cancel-button-text="取消"
                                               @confirm="deleteOutLine(item.id)">
                                    <template #reference>
                                        <el-button size="small">删除</el-button>
                                    </template>
                                </el-popconfirm>
                                &nbsp;
                                <span>{{ item.num + "-" + item.title }}</span>
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </div>
                <div class="outline_add" style="padding-top: 10px;height: 30%;overflow-y: auto">
                    <el-form :model="addFrom" :rules="rules" label-position="right" label-width="92.38px">
                        <el-form-item label="章节序号" prop="num">
                            <el-input-number
                                v-model="addFrom.num"
                                :step="1"
                                :step-strictly="true"
                                controls-position="right"
                                placeholder="请输入章节序号"
                            />
                        </el-form-item>
                        <el-form-item label="章节名称" prop="title">
                            <el-input v-model="addFrom.title" placeholder="请输入章节名称"/>
                        </el-form-item>
                        <el-form-item label="章节视频" prop="video_url">
                            <el-upload
                                :action="baseURL + '/api/manager/course/upload_video'"
                                :multiple="false"
                                :auto-upload="true"
                                :drag="true"
                                :show-file-list="false"
                                accept="video/"
                                name="video"
                                :limit="1"
                                :on-success="uploadSuccess"
                                :on-error="uploadError"
                                :on-exceed="uploadExceed"
                                v-show="!addFrom.video_url"
                                ref="upload"
                            >
                                <el-icon class="el-icon--upload">
                                    <upload-filled/>
                                </el-icon>
                                <div class="el-upload__text">
                                    点击或者拖拽上传
                                </div>
                            </el-upload>
                            <div class="upload-video" v-show="addFrom.video_url">
                                <div class="video">
                                    <video :src="baseURL + addFrom.video_url" controls="controls"></video>
                                </div>
                                <el-popconfirm title="您确定要删除视频吗？" confirm-button-text="确认" cancel-button-text="取消"
                                               @confirm="deleteAddUploadVideo">
                                    <template #reference>
                                        <div class="btn">删除</div>
                                    </template>
                                </el-popconfirm>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="outline_btn">
                    <el-button type="success" @click="submitAddOutline">新增</el-button>
                </div>
            </el-drawer>
        </template>
    </Mainer>
    <Footer></Footer>
</template>

<script>
import Header from '../../components/Header.vue'
import Footer from '../../components/Footer.vue'
import Mainer from '../../components/Mainer.vue'
import {baseURL, ajax} from '../../axios/index.js'
import {UploadFilled} from '@element-plus/icons'

export default {
    name: "Course",
    components: {Header, Footer, Mainer, UploadFilled},
    data() {
        return {
            baseURL,
            showLeftDrawer: false, //显示评论抽屉
            showRightDrawer: false, // 显示大纲抽屉
            drawerTitle: '', // 抽屉标题
            courses: [], // 课程列表
            comments: [], //课程评论列表
            outlines: [], //课程大纲列表
            ownTeachers: [], //所属老师列表
            ownCategories: [], //所属分类列表
            currentPage: 1, // 当前页码
            pageSize: 3, // 页码尺寸
            tempCourseId: 0, //临时课程id
            addFrom: {
                course_id: '',
                num: '',
                title: '',
                video_url: ''
            },
            rules: {
                course_id: [{required: true}],
                num: [{required: true}],
                title: [{required: true}],
                video_url: [{required: true}]
            }
        }
    },
    computed: {
        showTable() {
            return this.courses.slice(
                (this.currentPage - 1) * this.pageSize,
                this.currentPage * this.pageSize
            )
        }
    },
    created() {
        this.getAllData()
    },
    methods: {
        // 获取课程列表、所属老师列表、所属分类列表
        getAllData() {
            Promise.all([
                ajax(
                    'manager/course/course_list'
                ),
                ajax(
                    'manager/course/own_teachers'
                ),
                ajax(
                    'manager/course/own_categories'
                )
            ]).then(response => {
                console.log(response)
                this.courses = response[0].data.data.course_list
                this.ownTeachers = response[1].data.data
                this.ownCategories = response[2].data.data
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 获取课程列表
        getCourses() {
            ajax(
                'manager/course/course_list'
            ).then(response => {
                console.log(response)
                if (response.data.successful) {
                    this.courses = response.data.data.course_list
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                this.$message.error('网络请求出现错误')
            })
        },
        //设置当前页为点击页
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage
        },
        // 是否热门课程切换
        async isHotChange(row) {
            await ajax(
                'manager/course/update_is_hot',
                {
                    id: row.id,
                    is_hot: row.is_hot
                },
                'POST'
            ).then(response => {
                console.log(response.data)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.getCourses()
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 所属老师切换
        async ownTeachersChange(row) {
            await ajax(
                'manager/course/update_teacher',
                {
                    id: row.id,
                    teacher_id: row.teacher_id
                },
                'POST'
            ).then(response => {
                console.log(response.data)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.getCourses()
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 所属分类切换
        async ownCategoriesChange(row) {
            await ajax(
                'manager/course/update_category',
                {
                    id: row.id,
                    category_id: row.category_id
                },
                'POST'
            ).then(response => {
                console.log(response.data)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.getCourses()
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 跳转课程介绍编辑
        editCourse(index) {
            this.$router.push({
                path: '/course/edit/' + this.showTable[index].id
            })
        },
        // 跳转课程介绍详情
        courseIntro(index) {
            this.$router.push({
                path: '/course/intro/' + this.showTable[index].id
            })
        },
        // 打开课程评论
        courseComment(index) {
            ajax(
                'manager/course/course_comments',
                {
                    course_id: this.showTable[index].id
                }
            ).then(response => {
                console.log(response.data)
                if (response.data.successful) {
                    this.comments = response.data.data
                    this.drawerTitle = this.showTable[index].title
                    this.showLeftDrawer = true
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 打开课程大纲
        courseOutline(index) {
            this.drawerTitle = this.showTable[index].title
            this.addFrom.course_id = this.showTable[index].id
            this.getOutLineList()
        },
        // 获取课程大纲
        getOutLineList() {
            ajax(
                'manager/course/course_outlines',
                {
                    course_id: this.addFrom.course_id
                }
            ).then(response => {
                console.log(response.data)
                if (response.data.successful) {
                    this.outlines = response.data.data
                    this.showRightDrawer = true
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 删除大纲
        deleteOutLine(id) {
            ajax(
                'manager/course/del_outline',
                {
                    outline_id: id
                }
            ).then(response => {
                console.log(response.data)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.getOutLineList()
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 视频上传成功
        uploadSuccess(response) {
            console.log(response)
            this.$message.success(response.msg)
            this.addFrom.video_url = response.data.file_path
        },
        // 视频上传失败
        uploadError() {
            this.$message.error('图片上传失败')
        },
        // 视频上传超出数量
        uploadExceed() {
            this.$message.error('超出上传数量限制')
        },
        // 删除上传视频
        deleteAddUploadVideo() {
            ajax(
                'manager/course/delete_file',
                {
                    file_path: this.addFrom.video_url
                }
            ).then(response => {
                console.log(response)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.addFrom.video_url = ''
                    this.$refs.upload.clearFiles()
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 提交新增大纲
        submitAddOutline() {
            ajax(
                'manager/course/add_outline',
                {
                    course_id: this.addFrom.course_id,
                    num: this.addFrom.num,
                    title: this.addFrom.title,
                    video_url: this.addFrom.video_url
                },
                'POST'
            ).then(response => {
                console.log(response.data)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.getOutLineList()
                    this.addFrom.num = ''
                    this.addFrom.title = ''
                    this.addFrom.video_url = ''
                    this.$refs.upload.clearFiles()
                } else {
                    return this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 提交删除课程
        submitDeleteCourse(index) {
            ajax(
                'manager/course/course_delete',
                {
                    id: this.showTable[index].id
                }
            ).then(response => {
                console.log(response.data)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.getCourses()
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

/deep/ .el-input {
    width: 90%;
}

/deep/ .el-upload {
    width: 90%;
}

/deep/ .el-upload .el-upload-dragger {
    width: 100%;
    border: 1px solid #d9d9d9;
}

/deep/ .el-upload .el-upload-dragger:hover {
    width: 100%;
    border: 1px solid #409eff;
}

.upload-video {
    width: 90%;

    .video {
        video {
            width: 100%;
            height: 100%;
        }
    }

    .btn {
        height: 30px;
        background-color: red;
        line-height: 30px;
        text-align: center;
        color: #FFFFFF;
    }

    .btn:hover {
        cursor: pointer;
        height: 30px;
        background-color: red;
        line-height: 30px;
        text-align: center;
        color: #FFFFFF;
        opacity: 0.7;
    }
}

.from-item {
    width: 100%;
}
</style>