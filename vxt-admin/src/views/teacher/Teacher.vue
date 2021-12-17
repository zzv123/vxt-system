<template>
    <Header></Header>
    <Mainer>
        <template v-slot:main>
            <!-- 面包屑导航 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统首页</el-breadcrumb-item>
                <el-breadcrumb-item>讲师管理</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 内容区域 -->
            <div class="category-content">
                <div class="head">
                    <div class="head-wrapper">
                        <div class="head-title">讲师管理</div>
                        <div class="head-extra">
                            <el-button type="success" @click="showAddDialog = true">新增</el-button>
                        </div>
                    </div>
                </div>
                <div class="body">
                    <el-table :data="showTable" border
                              :header-cell-style="{background: '#fafafa',height: '55px',color: 'black'}"
                              :cell-style="{height: '97px'}">
                        <el-table-column align="center" prop="id" label="ID" width="80"/>
                        <el-table-column align="center" prop="name" label="姓名" width="150"/>
                        <el-table-column align="center" label="是否星级" width="100">
                            <!-- 自定义列模板，使用作用域插槽，通过scope.row获取当前行的数据 -->
                            <template #default="scope">
                                <el-switch v-model="scope.row.is_star" @change="isStarChange(scope.row)"
                                           inline-prompt :active-value="1" :inactive-value="0" active-text="是" inactive-text="否"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="position" label="职位" width="100"/>
                        <el-table-column align="center" label="头像" width="100">
                            <!-- 自定义列模板，使用作用域插槽，通过scope.row获取当前行的数据 -->
                            <template #default="scope">
                                <el-avatar size="64" :src="baseURL + scope.row.header"></el-avatar>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="intro" label="简介"/>
                        <el-table-column align="center" label="操作" width="200px">
                            <template #default="scope">
                                <el-button size="mini" @click="showEditDialogModel(scope.$index)"
                                >编辑
                                </el-button
                                >
                                <el-popconfirm title="是否确认要删除这个课程分类？" confirm-button-text="确认" cancel-button-text="取消"
                                               @confirm="submitDeleteCategory(scope.$index)">
                                    <template #reference>
                                        <el-button size="mini" type="danger">删除</el-button>
                                    </template>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination background layout="prev, pager, next" :total="this.teachers.length"
                                   :page-size="pageSize" @current-change="handleCurrentChange"></el-pagination>
                </div>
            </div>
            <!-- 编辑讲师弹框 -->
            <el-dialog v-model="showEditDialog" title="编辑讲师" width="450px" :destroy-on-close="true"
                       @closed="dialogClosed">
                <el-form :model="editFrom" :rules="rules" label-position="right" label-width="78.38px">
                    <el-form-item label="讲师ID" prop="id">
                        <el-input v-model="editFrom.id" placeholder="请输入讲师ID" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="讲师姓名" prop="name">
                        <el-input v-model="editFrom.name" placeholder="请输入讲师姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="讲师职位" prop="position">
                        <el-input v-model="editFrom.position" placeholder="请输入讲师职位"></el-input>
                    </el-form-item>
                    <el-form-item label="是否星级" prop="is_star">
                        <el-switch v-model="editFrom.is_star"
                                   inline-prompt :active-value="1" :inactive-value="0" active-text="是" inactive-text="否"></el-switch>
                    </el-form-item>
                    <el-form-item label="讲师简介" prop="intro">
                        <el-input type="textarea" :rows="2" v-model="editFrom.intro" placeholder="请输入讲师简介"></el-input>
                    </el-form-item>
                    <el-form-item label="讲师头像" prop="header">
                        <el-upload
                            :action="baseURL + '/api/manager/teacher/upload_header'"
                            :multiple="false"
                            :auto-upload="true"
                            :drag="true"
                            :show-file-list="false"
                            accept="image/png, image/jpeg"
                            name="header"
                            :limit=limitCount
                            :on-success="uploadEditSuccess"
                            :on-error="uploadError"
                            :on-exceed="uploadExceed"
                            v-show="!editFrom.header"
                            ref="upload"
                        >
                            <el-icon class="el-icon--upload">
                                <upload-filled/>
                            </el-icon>
                            <div class="el-upload__text">
                                点击或者拖拽上传
                            </div>
                        </el-upload>
                        <div class="upload-img" v-show="editFrom.header">
                            <div class="img">
                                <img :src="baseURL + editFrom.header" alt="暂无图片">
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
                    <el-button type="primary" @click="submitEditTeacher">提交</el-button>
                  </span>
                </template>
            </el-dialog>
            <!-- 新增讲师弹框 -->
            <el-dialog v-model="showAddDialog" title="新增讲师" width="450px" :destroy-on-close="true"
                       @closed="dialogClosed">
                <el-form :model="addFrom" :rules="rules" label-position="right" label-width="78.38px">
                    <el-form-item label="讲师姓名" prop="name">
                        <el-input v-model="addFrom.name" placeholder="请输入讲师姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="讲师职位" prop="position">
                        <el-input v-model="addFrom.position" placeholder="请输入讲师职位"></el-input>
                    </el-form-item>
                    <el-form-item label="是否星级" prop="is_star">
                        <el-switch v-model="addFrom.is_star"
                                   inline-prompt :active-value="1" :inactive-value="0" active-text="是" inactive-text="否"></el-switch>
                    </el-form-item>
                    <el-form-item label="讲师简介" prop="intro">
                        <el-input type="textarea" :rows="2" v-model="addFrom.intro" placeholder="请输入讲师简介"></el-input>
                    </el-form-item>
                    <el-form-item label="讲师头像" prop="header">
                        <el-upload
                            :action="baseURL + '/api/manager/teacher/upload_header'"
                            :multiple="false"
                            :auto-upload="true"
                            :drag="true"
                            :show-file-list="false"
                            accept="image/png, image/jpeg"
                            name="header"
                            :limit=limitCount
                            :on-success="uploadAddSuccess"
                            :on-error="uploadError"
                            :on-exceed="uploadExceed"
                            v-show="!addFrom.header"
                            ref="upload"
                        >
                            <el-icon class="el-icon--upload">
                                <upload-filled/>
                            </el-icon>
                            <div class="el-upload__text">
                                点击或者拖拽上传
                            </div>
                        </el-upload>
                        <div class="upload-img" v-show="addFrom.header">
                            <div class="img">
                                <img :src="baseURL + addFrom.header" alt="暂无图片">
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
                    <el-button type="primary" @click="submitAddTeacher">提交</el-button>
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
    name: "Teacher",
    components: {Header, Footer, Mainer, UploadFilled},
    data() {
        return {
            baseURL,
            teachers: [], // 分类列表
            currentPage: 1, // 当前页码
            pageSize: 3, // 页码尺寸
            showAddDialog: false, // 显示新增弹窗
            showEditDialog: false, // 显示编辑弹窗
            addFrom: {
                name: '',
                is_star: 0,
                intro: '',
                header: '',
                position: ''
            },
            editFrom: {
                id: '',
                name: '',
                is_star: 0,
                intro: '',
                header: '',
                position: ''
            },
            rules: {
                id: [{required: true}],
                name: [{required: true}],
                is_star: [{required: true}],
                intro: [{required: true}],
                header: [{required: true}],
                position: [{required: true}]
            },
            limitCount: 1 //上传数量限制
        }
    },
    computed: {
        showTable() {
            return this.teachers.slice(
                (this.currentPage - 1) * this.pageSize,
                this.currentPage * this.pageSize
            )
        }
    },
    created() {
        this.getTeachers()
    },
    methods: {
        // 获取讲师列表
        getTeachers() {
            ajax(
                'manager/teacher/teacher_list'
            ).then(response => {
                console.log(response)
                if (response.data.successful) {
                    this.teachers = response.data.data
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
        // 新增图片上传成功
        uploadAddSuccess(response) {
            console.log(response)
            this.$message.success(response.msg)
            this.addFrom.header = response.data.file_path
        },
        // 编辑图片上传成功
        uploadEditSuccess(response) {
            console.log(response)
            this.$message.success(response.msg)
            this.editFrom.header = response.data.file_path
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
                'manager/teacher/delete_file',
                {
                    file_path: this.addFrom.header
                }
            ).then(response => {
                console.log(response)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.addFrom.header = ''
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
                'manager/teacher/delete_file',
                {
                    file_path: this.editFrom.header
                }
            ).then(response => {
                console.log(response)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.editFrom.header = ''
                    this.$refs.upload.clearFiles()
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
            this.addFrom.name = ''
            this.addFrom.is_star = 0
            this.addFrom.intro = ''
            this.addFrom.header = ''
            this.addFrom.position = ''
            this.editFrom.id = ''
            this.editFrom.name = ''
            this.editFrom.is_star = 0
            this.editFrom.intro = ''
            this.editFrom.header = ''
            this.editFrom.position = ''
            this.$refs.upload.clearFiles()
        },
        // 展示编辑对话框
        showEditDialogModel(index) {
            this.showEditDialog = true
            this.editFrom.id = this.showTable[index].id
            this.editFrom.name = this.showTable[index].name
            this.editFrom.is_star = this.showTable[index].is_star
            this.editFrom.intro = this.showTable[index].intro
            this.editFrom.header = this.showTable[index].header
            this.editFrom.position = this.showTable[index].position
        },
        // 提交新增讲师
        submitAddTeacher() {
            ajax(
                'manager/teacher/teacher_add',
                {
                    name: this.addFrom.name,
                    is_star: this.addFrom.is_star,
                    intro: this.addFrom.intro,
                    header: this.addFrom.header,
                    position: this.addFrom.position
                },
                'POST'
            ).then(response => {
                console.log(response.data)
                if (response.data.successful) {
                    this.showAddDialog = false
                    this.$message.success(response.data.msg)
                    this.getTeachers()
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 提交编辑讲师
        submitEditTeacher() {
            ajax(
                'manager/teacher/teacher_update',
                {
                    id: this.editFrom.id,
                    name: this.editFrom.name,
                    is_star: this.editFrom.is_star,
                    intro: this.editFrom.intro,
                    header: this.editFrom.header,
                    position: this.editFrom.position
                },
                'POST'
            ).then(response => {
                console.log(response.data)
                if (response.data.successful) {
                    this.showEditDialog = false
                    this.$message.success(response.data.msg)
                    this.getTeachers()
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 提交删除讲师
        submitDeleteCategory(index) {
            ajax(
                'manager/teacher/teacher_delete',
                {
                    id: this.showTable[index].id
                }
            ).then(response => {
                console.log(response.data)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.getTeachers()
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 是否星级讲师切换
        async isStarChange(row) {
            await ajax(
                'manager/teacher/update_is_star',
                {
                    id: row.id,
                    is_star: row.is_star
                },
                'POST'
            ).then(response => {
                console.log(response.data)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.getTeachers()
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
.category-content {
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