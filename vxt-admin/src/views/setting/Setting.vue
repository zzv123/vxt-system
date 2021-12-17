<template>
    <Header></Header>
    <Mainer>
        <template v-slot:main>
            <!-- 面包屑导航 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统首页</el-breadcrumb-item>
                <el-breadcrumb-item>网站配置</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 内容区域 -->
            <div class="setting-content">
                <div class="head">
                    <div class="head-wrapper">
                        <div class="head-title">网站联系配置</div>
                        <div class="head-extra">
                            <el-button type="success" @click="submitUpdateConfig">更新</el-button>
                        </div>
                    </div>
                </div>
                <div class="body">
                    <div class="form-box">
                        <el-form :model="configDetail" :rules="rules" label-position="right" label-width="78.38px">
                            <el-form-item label="网站ID" prop="id">
                                <el-input v-model="configDetail.id" placeholder="请输入网站ID" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="手机号码" prop="tel">
                                <el-input v-model="configDetail.tel" placeholder="请输入手机号码"></el-input>
                            </el-form-item>
                            <el-form-item label="微信" prop="wechat_qrcode">
                                <el-upload
                                    :action="baseURL + '/api/manager/config/upload_img'"
                                    :multiple="false"
                                    :auto-upload="true"
                                    :drag="true"
                                    :show-file-list="false"
                                    accept="image/png, image/jpeg"
                                    name="img"
                                    :limit=limitCount
                                    :on-success="(response=>uploadSuccess(response, 'wechat_qrcode'))"
                                    :on-error="uploadError"
                                    :on-exceed="uploadExceed"
                                    v-show="!configDetail.wechat_qrcode"
                                    ref="upload"
                                >
                                    <el-icon class="el-icon--upload">
                                        <upload-filled/>
                                    </el-icon>
                                    <div class="el-upload__text">
                                        点击或者拖拽上传
                                    </div>
                                </el-upload>
                                <div class="upload-img" v-show="configDetail.wechat_qrcode">
                                    <div class="img">
                                        <img :src="baseURL + configDetail.wechat_qrcode" alt="暂无图片">
                                    </div>
                                    <el-popconfirm title="您确定要删除图片吗？" confirm-button-text="确认" cancel-button-text="取消"
                                                   @confirm="deleteUploadImg('wechat_qrcode')">
                                        <template #reference>
                                            <div class="btn">删除</div>
                                        </template>
                                    </el-popconfirm>
                                </div>
                            </el-form-item>
                            <el-form-item label="小程序" prop="mini_program">
                                <el-upload
                                    :action="baseURL + '/api/manager/config/upload_img'"
                                    :multiple="false"
                                    :auto-upload="true"
                                    :drag="true"
                                    :show-file-list="false"
                                    accept="image/png, image/jpeg"
                                    name="img"
                                    :limit=limitCount
                                    :on-success="(response=>uploadSuccess(response, 'mini_program'))"
                                    :on-error="uploadError"
                                    :on-exceed="uploadExceed"
                                    v-show="!configDetail.mini_program"
                                    ref="upload"
                                >
                                    <el-icon class="el-icon--upload">
                                        <upload-filled/>
                                    </el-icon>
                                    <div class="el-upload__text">
                                        点击或者拖拽上传
                                    </div>
                                </el-upload>
                                <div class="upload-img" v-show="configDetail.mini_program">
                                    <div class="img">
                                        <img :src="baseURL + configDetail.mini_program" alt="暂无图片">
                                    </div>
                                    <el-popconfirm title="您确定要删除图片吗？" confirm-button-text="确认" cancel-button-text="取消"
                                                   @confirm="deleteUploadImg('mini_program')">
                                        <template #reference>
                                            <div class="btn">删除</div>
                                        </template>
                                    </el-popconfirm>
                                </div>
                            </el-form-item>
                            <el-form-item label="微博" prop="wb_qrcode">
                                <el-upload
                                    :action="baseURL + '/api/manager/config/upload_img'"
                                    :multiple="false"
                                    :auto-upload="true"
                                    :drag="true"
                                    :show-file-list="false"
                                    accept="image/png, image/jpeg"
                                    name="img"
                                    :limit=limitCount
                                    :on-success="(response=>uploadSuccess(response, 'wb_qrcode'))"
                                    :on-error="uploadError"
                                    :on-exceed="uploadExceed"
                                    v-show="!configDetail.wb_qrcode"
                                    ref="upload"
                                >
                                    <el-icon class="el-icon--upload">
                                        <upload-filled/>
                                    </el-icon>
                                    <div class="el-upload__text">
                                        点击或者拖拽上传
                                    </div>
                                </el-upload>
                                <div class="upload-img" v-show="configDetail.wb_qrcode">
                                    <div class="img">
                                        <img :src="baseURL + configDetail.wb_qrcode" alt="暂无图片">
                                    </div>
                                    <el-popconfirm title="您确定要删除图片吗？" confirm-button-text="确认" cancel-button-text="取消"
                                                   @confirm="deleteUploadImg('wb_qrcode')">
                                        <template #reference>
                                            <div class="btn">删除</div>
                                        </template>
                                    </el-popconfirm>
                                </div>
                            </el-form-item>
                            <el-form-item label="APP" prop="app">
                                <el-upload
                                    :action="baseURL + '/api/manager/config/upload_img'"
                                    :multiple="false"
                                    :auto-upload="true"
                                    :drag="true"
                                    :show-file-list="false"
                                    accept="image/png, image/jpeg"
                                    name="img"
                                    :limit=limitCount
                                    :on-success="(response=>uploadSuccess(response, 'app'))"
                                    :on-error="uploadError"
                                    :on-exceed="uploadExceed"
                                    v-show="!configDetail.app"
                                    ref="upload"
                                >
                                    <el-icon class="el-icon--upload">
                                        <upload-filled/>
                                    </el-icon>
                                    <div class="el-upload__text">
                                        点击或者拖拽上传
                                    </div>
                                </el-upload>
                                <div class="upload-img" v-show="configDetail.app">
                                    <div class="img">
                                        <img :src="baseURL + configDetail.app" alt="暂无图片">
                                    </div>
                                    <el-popconfirm title="您确定要删除图片吗？" confirm-button-text="确认" cancel-button-text="取消"
                                                   @confirm="deleteUploadImg('app')">
                                        <template #reference>
                                            <div class="btn">删除</div>
                                        </template>
                                    </el-popconfirm>
                                </div>
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
import Header from '../../components/Header.vue'
import Footer from '../../components/Footer.vue'
import Mainer from '../../components/Mainer.vue'
import {baseURL, ajax} from '../../axios/index.js'
import {UploadFilled} from '@element-plus/icons'

export default {
    name: "Setting",
    components: {Header, Footer, Mainer, UploadFilled},
    data() {
        return {
            baseURL,
            configDetail: {},
            rules: [],
            limitCount: 1
        }
    },
    created() {
        this.getConfigDetail()
    },
    methods: {
        async getConfigDetail() {
            await ajax(
                'manager/config/config_detail'
            ).then(response => {
                console.log(response)
                if (response.data.successful) {
                    this.configDetail = response.data.data
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 图片上传成功
        uploadSuccess(response, type) {
            this.$message.success(response.msg)
            this.configDetail[`${type}`] = response.data.file_path
        },
        // 图片上传失败
        uploadError() {
            this.$message.error('图片上传失败')
        },
        // 图片上传超出数量
        uploadExceed() {
            this.$message.error('超出上传数量限制')
        },
        // 删除上传图片
        deleteUploadImg(type) {
            ajax(
                'manager/config/delete_file',
                {
                    file_path: this.configDetail[`${type}`]
                }
            ).then(response => {
                console.log(response)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.configDetail[`${type}`] = ''
                    this.$refs.upload.clearFiles()
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('网络请求出现错误')
            })
        },
        // 提交更新配置
        submitUpdateConfig() {
            ajax(
                'manager/config/config_update',
                {
                    id: this.configDetail.id,
                    tel: this.configDetail.tel,
                    wechat_qrcode: this.configDetail.wechat_qrcode,
                    mini_program: this.configDetail.mini_program,
                    wb_qrcode: this.configDetail.wb_qrcode,
                    app: this.configDetail.app
                },
                'POST'
            ).then(response => {
                console.log(response)
                if (response.data.successful) {
                    this.$message.success(response.data.msg)
                    this.getConfigDetail()
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
.setting-content {
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
            width: 378.38px;
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

    .img {
        width: 100%;
        height: 100%;

        img {
            width: 100%;
            height: 100%;
            vertical-align: bottom;
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
</style>