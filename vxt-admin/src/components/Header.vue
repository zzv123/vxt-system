<template>
    <div class="header">
        <div class="user">
            <img src="../assets/imgs/zzv.png"/>
            <span>欢迎您: 管理员</span>
            <el-popconfirm title="您确定要退出系统吗？" confirm-button-text="确认" cancel-button-text="取消" @confirm="quit">
                <template #reference>
                    <el-button type="danger" size="mini">退出</el-button>
                </template>
            </el-popconfirm>
        </div>
    </div>
</template>

<script>
export default {
    name: "Header",
    methods: {
        quit() {
            this.$router.push('/login')
            window.sessionStorage.setItem("activeRouter", "overview")
        }
    }
}
</script>

<style lang="less" scoped>
.header {
    width: 100%;
    background-color: #FFFFFF;
    height: 64px !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: black;
    position: relative;

    .user {
        display: flex;
        align-items: center;
        position: absolute;
        right: 20px;

        img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            margin-right: 10px;
        }

        span {
            margin-right: 10px;
        }

    }
}
</style>