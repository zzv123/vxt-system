<template>
    <div class="login-container">
        <div class="login-box">
            <!-- 头像 -->
            <div class="avatar-box">
                <img src="../assets/imgs/login_logo.png">
            </div>
            <!-- 标题 -->
            <div class="title">
                学堂后台管理系统
            </div>
            <!-- 登陆表单 -->
            <el-form ref="loginFormRef" class="login-form" :model="loginForm" :rules="loginFormRules">
                <el-form-item prop="username">
                    <el-input placeholder="请输入用户名"
                              v-model="loginForm.username">
                        <template #prefix>
                            <i class="iconfont icon-user"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" show-password
                              v-model="loginForm.password">
                        <template #prefix>
                            <i class="iconfont icon-lock"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="login-btn" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import {ajax} from '../axios/index.js'

export default {
    name: "Login",
    data() {
        return {
            // 表单的数据绑定对象
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            // 表单的校验规则
            loginFormRules: {
                username: [
                    {required: true, message: '请输入登陆账户', trigger: 'blur'},
                    {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入登陆密码', trigger: 'blur'},
                    {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        login() {
            // 判断是否校验成功
            this.$refs.loginFormRef.validate(async valid => {
                if (!valid) {
                    return
                }
                // 发送请求判断是否登录成功
                ajax(
                    'manager/admin/admin_login',
                    {
                        account: this.loginForm.username,
                        password: this.loginForm.password
                    },
                    'POST'
                ).then(response => {
                    console.log(response.data)
                    if (response.data.successful) {
                        this.$message.success('登录成功')
                        window.sessionStorage.setItem("activeRouter", '/overview')
                        window.localStorage.setItem("token", response.data.data.token)
                        this.$router.push('/home')
                    } else {
                        return this.$message.error('登陆失败')
                    }
                }).catch(error => {
                    console.log(error)
                })
            })
        }
    }
}
</script>

<style lang="less" scoped>
.login-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("../assets/imgs/login_bg.jpg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;

    .login-box {
        width: 400px;
        height: 400px;
        background: #FFFFFF;
        padding: 50px;
        border-radius: 6px;
        box-sizing: border-box;
        position: relative;
        border: 1px solid #CCCCCC;
        box-shadow: 0px 0px 15px #CCCCCC;

        .avatar-box {
            width: 120px;
            height: 120px;
            border: 1px solid #cccccc;
            border-radius: 100px;
            text-align: center;
            line-height: 120px;
            position: absolute;
            top: -60px;
            right: 140px;
            background: #fff;

            img {
                width: 70px;
                height: 70px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }

        .title {
            margin-top: 50px;
            text-align: center;
            font-size: 30px;
            font-weight: bolder;
            color: #444444;
        }

        .login-form {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translate(-50%);
            padding: 0 20px;
            width: 80%;
            box-sizing: border-box;

            .login-btn {
                width: 100%;
            }
        }
    }
}
</style>