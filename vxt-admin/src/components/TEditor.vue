<template>
    <Editor v-model="content" tag-name="div" :init="init"/>
</template>

<script>
//引入tinymce编辑器
import Editor from "@tinymce/tinymce-vue";
//引入方式引入node_modules里的tinymce相关文件文件
import tinymce from "tinymce/tinymce"; //tinymce默认hidden，不引入则不显示编辑器
import "tinymce/themes/silver/theme"; // 引用主题文件，不引入则报错
import "tinymce/icons/default"; // 引用图标文件，不引入则不显示对应图标
//引入编辑器插件
import "tinymce/plugins/link"; //超链接
import "tinymce/plugins/table"; //表格
import "tinymce/plugins/lists"; //列表插件
import "tinymce/plugins/advlist"; //高级列表
import "tinymce/plugins/anchor"; //锚点
import "tinymce/plugins/autolink"; //自动链接
import "tinymce/plugins/autoresize"; //编辑器高度自适应,注：plugins里引入此插件时，Init里设置的height将失效
import "tinymce/plugins/autosave"; //自动存稿
import "tinymce/plugins/charmap"; //特殊字符
import "tinymce/plugins/code"; //查看源码
import "tinymce/plugins/codesample"; //插入代码
import "tinymce/plugins/directionality"; //文字方向
import 'tinymce/plugins/emoticons'  //表情
import "tinymce/plugins/fullpage"; //文档属性
import "tinymce/plugins/fullscreen"; //全屏
import "tinymce/plugins/help"; //帮助
import "tinymce/plugins/hr"; //水平分割线
import "tinymce/plugins/image"; //插入编辑图片
import "tinymce/plugins/imagetools"; //图片工具
import "tinymce/plugins/importcss"; //引入css
import "tinymce/plugins/insertdatetime"; //时间插入
import "tinymce/plugins/media"; //媒体插入
import "tinymce/plugins/nonbreaking"; //不间断空格
import "tinymce/plugins/noneditable"; //不间断表格
import "tinymce/plugins/pagebreak"; //分页
import "tinymce/plugins/paste"; //粘贴
import "tinymce/plugins/preview"; //预览
import "tinymce/plugins/print"; //打印
import "tinymce/plugins/quickbars"; //快速工具栏
import "tinymce/plugins/save"; //保存
import "tinymce/plugins/searchreplace"; //查询替换
import "tinymce/plugins/spellchecker"; //拼写检查，暂未加入汉化，不建议使用
import "tinymce/plugins/tabfocus"; //切入切出，按tab键切出编辑器，切入页面其他输入框中
import "tinymce/plugins/template"; //内容模板
import 'tinymce/plugins/textcolor'  //文字颜色
import "tinymce/plugins/textpattern"; //快速排版
import "tinymce/plugins/toc"; //目录生成器
import "tinymce/plugins/visualblocks"; //显示元素范围
import "tinymce/plugins/visualchars"; //显示不可见字符
import "tinymce/plugins/wordcount"; //数字统计
export default {
    name: 'TEditor',
    props: {
        modelValue: String
    },
    components: {
        Editor
    },
    emits: {"update:modelValue": null},
    setup(props, context) {
        const init = {
            language_url: '/tinymce/langs/zh_CN.js', // 语言包路径
            language: "zh_CN", //语言类型
            skin_url: '/tinymce/skins/ui/oxide', // 编辑器皮肤样式（浅色：oxide，深色：oxide-dark）
            plugins:
                "print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave", // 插件需要import进来
            toolbar:
                "fullscreen undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | table image media charmap emoticons hr pagebreak insertdatetime print preview | code selectall | indent2em lineheight formatpainter axupimgs",
            menubar: true, // 控制菜单显示与隐藏
            fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px", //字体大小
            font_formats:
                "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
            min_height: 500,
            placeholder: '在这里输入文字',
            branding: false,  //tiny技术支持信息是否显示
            resize: false, // 编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
            statusbar: true, // 最下方的元素路径和字数统计那一栏是否显示
            elementpath: false, //元素路径是否显示
            content_style: "img {max-width:100%;}", //直接自定义可编辑区域的css样式
            //   图片上传
            images_upload_handler: function (blobInfo, success, failure) {
                const img = 'data:image/jpeg;base64,' + blobInfo.base64()
                success(img)
            },
        };
        tinymce.init; // 初始化
        const revert_data = (content) => {
            context.emit('update:modelValue', content)
        }
        return {
            init, revert_data
        };
    },
    data() {
        return {
            content: this.modelValue,
        };
    },
    mounted() {
    },
    watch: {
        content() {
            this.revert_data(this.content)
        },
    },
};
</script>