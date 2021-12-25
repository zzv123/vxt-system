<!-- 文章列表 -->
<template>
	<view class="content">
		<!-- 搜索框 -->
		<SearchInput></SearchInput>
		<template v-for="(item, index) in articleList">
			<view class="article_item" @click="navToArticleDetail(item.id)">
				<view class="row">
					<text class="left">文章标题：</text>
					<text class="right">{{item.title}}</text>
				</view>
				<view class="row">
					<text class="left">发布时间：</text>
					<text class="right">{{formatTime(item.create_time)}}</text>
				</view>
				<view class="row">
					<text class="left">文章简介：</text>
					<text class="right">{{item.intro}}</text>
				</view>
			</view>
		</template>
		<!-- 空状态 -->
		<u-empty text="暂无结果" mode="data" v-if="articleList.length === 0"></u-empty>
	</view>
</template>

<script>
	let app = getApp()
	import SearchInput from '../../components/SearchInput/SearchInput.vue'
	import config from '../../config/config.js'
	import moment from '../../utils/moment.min.js'
	export default {
		components: {
			SearchInput
		},
		data() {
			return {
				// 文章数组
				articleList: [],
				// 分页页码
				page_num: 1,
				// 分页尺度
				page_size: 10,
				// 是否到底
				page_over: false
			}
		},
		onLoad(options) {
			this.getArticleList()
		},
		onReachBottom() {
			if(this.page_over) {
				uni.showToast({
					title: '到底啦~~',
					icon: 'none'
				})
			}else {
				uni.showLoading({
					title: '加载中'
				})
				this.page_num = this.page_num + 1
				this.getArticleList()
			}
		},
		methods: {
			// 时间处理
			formatTime(time) {
				return moment(time).format('YYYY-MM-DD HH:MM:SS')
			},
			// 获取文章列表
			getArticleList() {
				this.request({
					url: config.article_list,
					data: {
						page_num: this.page_num,
						page_size: this.page_size
					}
				}).then(result => {
					uni.hideLoading()
					console.log(result)
					if(result.data.length === 0 || result.data.length < this.page_size) {
						this.page_over = true
						uni.showToast({
							title: '到底啦~~',
							icon: 'none'
						})
					}
					this.articleList = this.articleList.concat(result.data)
				})
			},
			// 跳转文章详情页
			navToArticleDetail(id) {
				uni.navigateTo({
					url: '../articledetail/articledetail?id=' + id
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $zzv-bg-color;

		.content {
			.article_item {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 8px;
				margin: 8px;
				background-color: #fff;
				border: 1px solid #eaeaea;

				.row {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
</style>
