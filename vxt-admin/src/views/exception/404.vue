<template>
    <Header></Header>
    <Mainer>
        <template v-slot:main>
            <el-result title="404" sub-title="抱歉，您访问的页面不存在。">
                <template #icon>
                    <el-image
                        :src=imgURL
                    ></el-image>
                </template>
                <template #extra>
                    <el-button type="primary" size="medium" @click="toHome">返回首页</el-button>
                </template>
            </el-result>
        </template>
    </Mainer>
    <Footer></Footer>
</template>

<script>
import Header from '../../components/Header.vue'
import Footer from '../../components/Footer.vue'
import Mainer from '../../components/Mainer.vue'
import imgURL from '../../assets/imgs/status/404.png'

export default {
    name: "404",
    components: {Header, Footer, Mainer, imgURL},
    data() {
        return {
            imgURL
        }
    },
    methods: {
        toHome() {
            window.sessionStorage.setItem("activeRouter", '/overview')
            this.$router.push('/home')
        }
    }
}
</script>

<style scoped>

</style>