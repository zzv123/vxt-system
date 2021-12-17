<template>
    <Header></Header>
    <Mainer>
        <template v-slot:main>
            <!-- 面包屑导航 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统首页</el-breadcrumb-item>
                <el-breadcrumb-item>分类管理</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 内容区域 -->
            <div class="category-content">
                <div class="head">
                    <div class="head-wrapper">
                        <div class="head-title">课程分类管理</div>
                        <div class="head-extra">
                            <el-button type="success" @click="showAddDialog = true">新增</el-button>
                        </div>
                    </div>
                </div>
                <div class="body">
                    <el-table :data="showTable" border
                              :header-cell-style="{background: '#fafafa',height: '55px',color: 'black'}"
                              :cell-style="{height: '65px'}">
                        <el-table-column align="center" prop="id" label="ID" width="150"/>
                        <el-table-column align="center" prop="title" label="分类名称"/>
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
                    <el-pagination background layout="prev, pager, next" :total="this.categorys.length"
                                   :page-size="pageSize" @current-change="handleCurrentChange"></el-pagination>
                </div>
            </div>
            <!-- 编辑课程分类弹框 -->
            <el-dialog v-model="showEditDialog" title="编辑课程分类" width="450px" :destroy-on-close="true"
                       @closed="dialogClosed">
                <el-form :model="editFrom" :rules="rules" label-position="right" label-width="78.38px">
                    <el-form-item label="分类ID" prop="id">
                        <el-input v-model="editFrom.id" placeholder="请输入分类ID" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="分类名称" prop="title">
                        <el-input v-model="editFrom.title" placeholder="请输入分类名称"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="showEditDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitEditCategory">提交</el-button>
                  </span>
                </template>
            </el-dialog>
            <!-- 新增课程分类弹框 -->
            <el-dialog v-model="showAddDialog" title="新增课程分类" width="450px" :destroy-on-close="true"
                       @closed="dialogClosed">
                <el-form :model="addFrom" :rules="rules" label-position="right" label-width="78.38px">
                    <el-form-item label="分类名称" prop="title">
                        <el-input v-model="addFrom.title" placeholder="请输入分类名称"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="showAddDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitAddCategory">提交</el-button>
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
import {ajax} from '../../axios/index.js'

export default {
    name: "Category",
    components: {Header, Footer, Mainer},
    data() {
        return {
            categorys: [], // 分类列表
            currentPage: 1, // 当前页码
            pageSize: 5, // 页码尺寸
            showAddDialog: false, // 显示新增弹窗
            showEditDialog: false, // 显示编辑弹窗
            addFrom: {
                title: ''
            },
            editFrom: {
                id: '',
                title: ''
            },
            rules: {
                id: [{required: true}],
                title: [{required: true}]
            },
        }
    },
    computed: {
        showTable() {
            return this.categorys.slice(
                (this.currentPage - 1) * this.pageSize,
                this.currentPage * this.pageSize
            )
        }
    },
    created() {
        this.getCategorys()
    },
    methods: {
        // 获取分类列表
        getCategorys() {
            ajax(
                'manager/category/category_list'
            ).then(response => {
                console.log(response)
                if (response.data.successful) {
                    this.categorys = response.data.data
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
        // 对话框关闭
        dialogClosed() {
            this.addFrom.title = ''
            this.editFrom.id = ''
            this.editFrom.title = ''
        },
        // 提交新增分类
        submitAddCategory() {
            ajax(
                'manager/category/category_add',
                {
                    title: this.addFrom.title
                },
                'POST'
            ).then(response => {
                console.log(response.data)
                if (response.data.successful) {
                    this.showAddDialog = false
                    this.$message.success(response.data.msg)
                    this.getCategorys()
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 展示编辑对话框
        showEditDialogModel(index) {
            this.showEditDialog = true
            this.editFrom.id = this.showTable[index].id
            this.editFrom.title = this.showTable[index].title
        },
        // 提交编辑分类
        submitEditCategory() {
            ajax(
                'manager/category/category_update',
                {
                    id: this.editFrom.id,
                    title: this.editFrom.title
                },
                'POST'
            ).then(response => {
                console.log(response.data)
                if (response.data.successful) {
                    this.showEditDialog = false
                    this.$message.success(response.data.msg)
                    this.getCategorys()
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 提交删除分类
        submitDeleteCategory(index) {
            ajax(
                'manager/category/category_delete',
                {
                    id: this.showTable[index].id
                }
            ).then(response => {
                console.log(response.data)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.getCategorys()
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
</style>