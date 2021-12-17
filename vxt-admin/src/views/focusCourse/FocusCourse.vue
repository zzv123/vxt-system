<template>
    <Header></Header>
    <Mainer>
        <template v-slot:main>
            <!-- 面包屑导航 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统首页</el-breadcrumb-item>
                <el-breadcrumb-item>焦点课程</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 内容区域 -->
            <div class="focus-course">
                <div class="head">
                    <div class="head-wrapper">
                        <div class="head-title">焦点课程管理</div>
                        <div class="head-extra">
                            <el-button type="success" @click="showEditDialogModel">编辑</el-button>
                            <el-button type="primary" @click="showAddDialog = true">新增</el-button>
                            <el-popconfirm title="是否确认要删除这个焦点课程广告？" confirm-button-text="确认" cancel-button-text="取消"
                                           @confirm="submitDeleteAdCourse">
                                <template #reference>
                                    <el-button type="danger">删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </div>
                </div>
                <div class="body">
                    <div class="top">
                        <div class="prev" @click="carouselPrev">
                            <i class="iconfont icon-zuoshuangjiantou"></i>
                        </div>
                        <div class="left">
                            <el-carousel height="250px" trigger="click" :autoplay="false" arrow="never"
                                         @change="carouselChange" v-if="adCourseList.length !== 0" ref="carouselLeft">
                                <el-carousel-item v-for="(item, index) in adCourseList" :key="item.id" :name="index">
                                    <img :src="baseURL + item.ad_url" alt="暂无图片">
                                </el-carousel-item>
                            </el-carousel>
                        </div>
                        <div class="right">
                            <el-carousel height="250px" trigger="click" :autoplay="false" arrow="never"
                                         @change="carouselChange" v-if="adCourseList.length !== 0" ref="carouselRight">
                                <el-carousel-item v-for="(item, index) in adCourseList" :key="item.id" :name="index">
                                    <img :src="baseURL + item.fm_url" alt="暂无图片">
                                </el-carousel-item>
                            </el-carousel>
                        </div>
                        <div class="next" @click="carouselNext">
                            <i class="iconfont icon-youshuangjiantou"></i>
                        </div>
                    </div>
                    <el-divider content-position="left">焦点图详情描述</el-divider>
                    <div class="bottom" v-if="adCourseList.length > 0">
                        <div class="detail">焦点图ID: {{ adCourseList[carouselIndex].id }}</div>
                        <div class="detail">焦点图标题: {{ adCourseList[carouselIndex].title }}</div>
                        <div class="detail">课程ID: {{ adCourseList[carouselIndex].course_id }}</div>
                        <div class="detail">课程标题: {{ adCourseList[carouselIndex].course_title }}</div>
                    </div>
                </div>
            </div>
            <!-- 编辑焦点课程弹框 -->
            <el-dialog v-model="showEditDialog" title="编辑焦点课程" width="450px" :destroy-on-close="true"
                       @closed="dialogClosed">
                <el-form :model="editFrom" :rules="rules" label-position="right" label-width="92.38px">
                    <el-form-item label="焦点图ID" prop="id">
                        <el-input v-model="editFrom.id" placeholder="请输入焦点图ID" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="焦点图标题" prop="title">
                        <el-input v-model="editFrom.title" placeholder="请输入焦点图标题"></el-input>
                    </el-form-item>
                    <el-form-item label="关联的课程" prop="course_id">
                        <el-select v-model="editFrom.course_id" placeholder="请选择关联的课程" class="from-item">
                            <el-option v-for="item in linkCourseList" :key="item.id" :label="item.title"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="焦点图封面" prop="ad_url">
                        <el-upload
                            :action="baseURL + '/api/manager/ad_course/upload_ad_img'"
                            :multiple="false"
                            :auto-upload="true"
                            :drag="true"
                            :show-file-list="false"
                            accept="image/png, image/jpeg"
                            name="ad_img"
                            :limit=limitCount
                            :on-success="uploadEditSuccess"
                            :on-error="uploadError"
                            :on-exceed="uploadExceed"
                            v-show="!editFrom.ad_url"
                            ref="upload"
                        >
                            <el-icon class="el-icon--upload">
                                <upload-filled/>
                            </el-icon>
                            <div class="el-upload__text">
                                点击或者拖拽上传
                            </div>
                        </el-upload>
                        <div class="upload-img" v-show="editFrom.ad_url">
                            <div class="img">
                                <img :src="baseURL + editFrom.ad_url" alt="暂无图片">
                            </div>
                            <el-popconfirm title="您确定要删除图片吗？" confirm-button-text="确认" cancel-button-text="取消"
                                           @confirm="deleteEditUploadImg">
                                <template #reference>
                                    <div class="btn">删除</div>
                                </template>
                            </el-popconfirm>
                        </div>
                    </el-form-item>
                </el-form>
                <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="showAddDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitEditAdCourse">提交</el-button>
                  </span>
                </template>
            </el-dialog>
            <!-- 新增焦点课程弹框 -->
            <el-dialog v-model="showAddDialog" title="新增焦点课程" width="450px" :destroy-on-close="true"
                       @closed="dialogClosed">
                <el-form :model="addFrom" :rules="rules" label-position="right" label-width="92.38px">
                    <el-form-item label="焦点图标题" prop="title">
                        <el-input v-model="addFrom.title" placeholder="请输入焦点图标题"></el-input>
                    </el-form-item>
                    <el-form-item label="关联的课程" prop="course_id">
                        <el-select v-model="addFrom.course_id" placeholder="请选择关联的课程" class="from-item">
                            <el-option v-for="item in linkCourseList" :key="item.id" :label="item.title"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="焦点图封面" prop="ad_url">
                        <el-upload
                            :action="baseURL + '/api/manager/ad_course/upload_ad_img'"
                            :multiple="false"
                            :auto-upload="true"
                            :drag="true"
                            :show-file-list="false"
                            accept="image/png, image/jpeg"
                            name="ad_img"
                            :limit=limitCount
                            :on-success="uploadAddSuccess"
                            :on-error="uploadError"
                            :on-exceed="uploadExceed"
                            v-show="!addFrom.ad_url"
                            ref="upload"
                        >
                            <el-icon class="el-icon--upload">
                                <upload-filled/>
                            </el-icon>
                            <div class="el-upload__text">
                                点击或者拖拽上传
                            </div>
                        </el-upload>
                        <div class="upload-img" v-show="addFrom.ad_url">
                            <div class="img">
                                <img :src="baseURL + addFrom.ad_url" alt="暂无图片">
                            </div>
                            <el-popconfirm title="您确定要删除图片吗？" confirm-button-text="确认" cancel-button-text="取消"
                                           @confirm="deleteAddUploadImg">
                                <template #reference>
                                    <div class="btn">删除</div>
                                </template>
                            </el-popconfirm>
                        </div>
                    </el-form-item>
                </el-form>
                <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="showAddDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitAddAdCourse">提交</el-button>
                  </span>
                </template>
            </el-dialog>
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
    name: "FocusCourse",
    components: {Mainer, Footer, Header, UploadFilled},
    data() {
        return {
            baseURL,
            adCourseList: [], // 焦点图列表
            linkCourseList: [], // 关联课程列表
            carouselIndex: 0, // 当前焦点图索引
            showAddDialog: false, // 显示新增弹窗
            showEditDialog: false, // 显示编辑弹窗
            addFrom: {
                title: '',
                ad_url: '',
                course_id: ''
            },
            editFrom: {
                id: '',
                title: '',
                ad_url: '',
                course_id: ''
            },
            rules: {
                id: [{required: true, message: '焦点图id是必填项'}],
                title: [{required: true, message: '焦点图标题是必填项'}],
                course_id: [{required: true, message: '焦点图课程是必填项'}],
                ad_url: [{required: true, message: '焦点图图片是必填项'}]
            },
            limitCount: 1 //上传数量限制
        }
    },
    created() {
        this.getAdCourseAndLinkCourse()
    },
    methods: {
        // 获取焦点图列表和关联课程列表
        getAdCourseAndLinkCourse() {
            Promise.all([
                ajax(
                    'manager/ad_course/ad_course_list'
                ),
                ajax(
                    'manager/ad_course/link_course'
                )
            ]).then(response => {
                console.log(response)
                this.adCourseList = response[0].data.data
                this.linkCourseList = response[1].data.data
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 上一张图片
        carouselPrev() {
            this.$refs.carouselLeft.prev()
        },
        // 下一张图片
        carouselNext() {
            this.$refs.carouselRight.next()
        },
        // 轮播图改变
        carouselChange(e) {
            this.carouselIndex = e
            this.$refs.carouselLeft.setActiveItem(e)
            this.$refs.carouselRight.setActiveItem(e)
        },
        // 新增图片上传成功
        uploadAddSuccess(response) {
            console.log(response)
            this.$message.success(response.msg)
            this.addFrom.ad_url = response.data.file_path
        },
        // 编辑图片上传成功
        uploadEditSuccess(response) {
            console.log(response)
            this.$message.success(response.msg)
            this.editFrom.ad_url = response.data.file_path
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
        deleteAddUploadImg() {
            ajax(
                'manager/ad_course/delete_file',
                {
                    file_path: this.addFrom.ad_url
                }
            ).then(response => {
                console.log(response)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.addFrom.ad_url = ''
                    this.$refs.upload.clearFiles()
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 删除编辑上传图片
        deleteEditUploadImg() {
            ajax(
                'manager/ad_course/delete_file',
                {
                    file_path: this.editFrom.ad_url
                }
            ).then(response => {
                console.log(response)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.editFrom.ad_url = ''
                    this.$refs.upload.clearFiles()
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 编辑焦点课程提交
        submitEditAdCourse() {
            ajax(
                'manager/ad_course/ad_course_update',
                {
                    id: this.editFrom.id,
                    title: this.editFrom.title,
                    ad_url: this.editFrom.ad_url,
                    course_id: this.editFrom.course_id
                },
                'POST'
            ).then(response => {
                console.log(response.data)
                if (response.data.successful) {
                    this.showEditDialog = false
                    this.$message.success(response.data.msg)
                    this.getAdCourseAndLinkCourse()
                } else {
                    return this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 新增焦点课程提交
        submitAddAdCourse() {
            ajax(
                'manager/ad_course/ad_course_add',
                {
                    title: this.addFrom.title,
                    ad_url: this.addFrom.ad_url,
                    course_id: this.addFrom.course_id
                },
                'POST'
            ).then(response => {
                console.log(response.data)
                if (response.data.successful) {
                    this.showAddDialog = false
                    this.$message.success(response.data.msg)
                    this.getAdCourseAndLinkCourse()
                } else {
                    return this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 删除焦点课程提交
        submitDeleteAdCourse() {
            ajax(
                'manager/ad_course/ad_course_delete',
                {
                    id: this.adCourseList[this.carouselIndex].id
                }
            ).then(response => {
                console.log(response)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.getAdCourseAndLinkCourse()
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 对话框关闭
        dialogClosed() {
            this.addFrom.title = ''
            this.addFrom.course_id = ''
            this.addFrom.ad_url = ''
            this.editFrom.id = ''
            this.editFrom.title = ''
            this.editFrom.course_id = ''
            this.editFrom.ad_url = ''
            this.$refs.upload.clearFiles()
        },
        // 展示编辑对话框
        showEditDialogModel() {
            this.showEditDialog = true
            this.editFrom.id = this.adCourseList[this.carouselIndex].id
            this.editFrom.title = this.adCourseList[this.carouselIndex].title
            this.editFrom.course_id = this.adCourseList[this.carouselIndex].course_id
            this.editFrom.ad_url = this.adCourseList[this.carouselIndex].ad_url
        }
    }
}
</script>

<style lang="less" scoped>
.focus-course {
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
        height: 400px;
        padding: 24px;

        .top {
            display: flex;
            height: 250px;

            .prev {
                width: 30px;
                background-color: #666666;
                text-align: center;
                line-height: 250px;
                color: #FFFFFF;
                font-size: 26px;
            }

            .left {
                flex: 2;
                margin-right: 15px;
                overflow: hidden;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .right {
                flex: 1;
                overflow: hidden;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .next {
                width: 30px;
                background-color: #666666;
                text-align: center;
                line-height: 250px;
                color: #FFFFFF;
                font-size: 26px;
            }
        }

        .el-divider--horizontal {
            height: 1px;
            background-color: #F0F0F0;
        }

        .bottom {
            display: flex;

            .detail {
                height: 100px;
                flex: 1;
                text-align: center;
                line-height: 100px;
            }
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

    .img {
        height: 150px;

        img {
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