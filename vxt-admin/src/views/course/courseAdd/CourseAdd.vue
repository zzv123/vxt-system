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
                        <div class="head-title">
                            <el-breadcrumb separator-class="el-icon-arrow-right">
                                <el-breadcrumb-item to="/course" replace>课程列表</el-breadcrumb-item>
                                <el-breadcrumb-item>新增课程</el-breadcrumb-item>
                            </el-breadcrumb>
                        </div>
                        <div class="head-extra">
                            <el-button type="success" @click="submitAddCourse">保存</el-button>
                        </div>
                    </div>
                </div>
                <div class="body">
                    <div class="form-box">
                        <el-form :model="addFrom" :rules="rules" label-position="right" label-width="80px">
                            <el-form-item label="课程标题" prop="title">
                                <el-input v-model="addFrom.title" placeholder="请填写课程标题"></el-input>
                            </el-form-item>
                            <el-form-item label="是否热门" prop="is_hot">
                                <el-switch v-model="addFrom.is_hot"
                                           inline-prompt :active-value="1" :inactive-value="0" active-text="是" inactive-text="否"></el-switch>
                            </el-form-item>
                            <el-form-item label="所属讲师" prop="teacher_id">
                                <el-select v-model="addFrom.teacher_id" placeholder="请选择所属讲师" class="from-item" style="width:100%">
                                    <el-option v-for="item in ownTeachers" :key="item.id" :label="item.name"
                                               :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="所属分类" prop="category_id">
                                <el-select v-model="addFrom.category_id" placeholder="请选择所属分类" class="from-item" style="width:100%">
                                    <el-option v-for="item in ownCategories" :key="item.id" :label="item.title"
                                               :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="课程封面" prop="fm_url">
                                <el-upload
                                    :action="baseURL + '/api/manager/course/upload_fm'"
                                    :multiple="false"
                                    :auto-upload="true"
                                    :drag="true"
                                    :show-file-list="false"
                                    accept="image/png, image/jpeg"
                                    name="fm"
                                    :limit=limitCount
                                    :on-success="uploadSuccess"
                                    :on-error="uploadError"
                                    :on-exceed="uploadExceed"
                                    v-show="!addFrom.fm_url"
                                    ref="upload"
                                >
                                    <el-icon class="el-icon--upload">
                                        <upload-filled/>
                                    </el-icon>
                                    <div class="el-upload__text">
                                        点击或者拖拽上传
                                    </div>
                                </el-upload>
                                <div class="upload-img" v-show="addFrom.fm_url">
                                    <div class="img">
                                        <el-image :src="baseURL + addFrom.fm_url" :fit="fit" alt="暂无图片"></el-image>
                                    </div>
                                    <el-popconfirm title="您确定要删除图片吗？" confirm-button-text="确认" cancel-button-text="取消"
                                                   @confirm="deleteUploadImg">
                                        <template #reference>
                                            <div class="btn">删除</div>
                                        </template>
                                    </el-popconfirm>
                                </div>
                            </el-form-item>
                            <el-form-item label="课程简介" prop="intro">
                                <TEditor v-model="addFrom.intro"/>
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
import {baseURL, ajax} from '../../../axios/index.js'
import TEditor from '../../../components/TEditor.vue'
import {UploadFilled} from '@element-plus/icons'

export default {
    name: "CourseAdd",
    components: {Header, Footer, Mainer, TEditor, UploadFilled},
    data() {
        return {
            baseURL,
            addFrom: {
                title: '',
                fm_url: '',
                is_hot: '',
                intro: '',
                teacher_id: '',
                category_id: ''
            },
            rules: {
                title: [{required: true}],
                fm_url: [{required: true}],
                is_hot: [{required: true}],
                intro: [{required: true}],
                teacher_id: [{required: true}],
                category_id: [{required: true}]
            },
            ownTeachers: [], //所属老师列表
            ownCategories: [], //所属分类列表
            limitCount: 1 //上传数量限制
        }
    },
    created() {
        this.getAllData()
    },
    methods: {
        // 获取所属老师列表、所属分类列表
        getAllData() {
            Promise.all([
                ajax(
                    'manager/course/own_teachers'
                ),
                ajax(
                    'manager/course/own_categories'
                )
            ]).then(response => {
                console.log(response)
                this.ownTeachers = response[0].data.data
                this.ownCategories = response[1].data.data
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 新增图片上传成功
        uploadSuccess(response) {
            console.log(response)
            this.$message.success(response.msg)
            this.addFrom.fm_url = response.data.file_path
        },
        // 图片上传失败
        uploadError() {
            this.$message.error('图片上传失败')
        },
        // 图片上传超出数量
        uploadExceed() {
            this.$message.error('超出上传数量限制')
        },
        // 删除新增上传图片
        deleteUploadImg() {
            ajax(
                'manager/course/delete_file',
                {
                    file_path: this.addFrom.fm_url
                }
            ).then(response => {
                console.log(response)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.addFrom.fm_url = ''
                    this.$refs.upload.clearFiles()
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 保存新增课程
        submitAddCourse() {
            ajax(
                'manager/course/course_add',
                {
                    title: this.addFrom.title,
                    fm_url: this.addFrom.fm_url,
                    is_hot: this.addFrom.is_hot,
                    intro: this.addFrom.intro,
                    teacher_id: this.addFrom.teacher_id,
                    category_id: this.addFrom.category_id
                },
                'POST'
            ).then(response => {
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.$router.push('/course')
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
/deep/ .el-upload {
    width: 100%;
}

/deep/ .el-upload .el-upload-dragger {
    width: 100%;
    border: 1px solid #d9d9d9;
}

/deep/ .el-upload .el-upload-dragger:hover {
    width: 100%;
    border: 1px solid #409eff;
}

.upload-img {
    width: 100%;
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
</style>