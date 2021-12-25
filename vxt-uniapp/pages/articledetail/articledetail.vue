<template>
	<view class="content">
		<view class="artile_title">
			{{articleDetail.title}}
		</view>
		<view class="artile_time">
			{{formatTime(articleDetail.create_time)}}
		</view>
		<view class="artile_detail">
			<u-parse :html="articleDetail.content"></u-parse>
		</view>
	</view>
</template>

<script>
	let app = getApp()
	import config from '../../config/config.js'
	import moment from '../../utils/moment.min.js'
	export default {
		data() {
			return {
				articleDetail: {}
			}
		},
		onLoad(options) {
			this.getArticleDetail(options.id)
		},
		methods: {
			// 时间处理
			formatTime(time) {
				return moment(time).format('YYYY-MM-DD HH:MM:SS')
			},
			// 获取文章详情
			getArticleDetail(id) {
				this.request({
					url: config.article_detail + `/${id}`,
				}).then(result => {
					console.log(result)
					this.articleDetail = result.data
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		.content {
			.artile_title {
				text-align: center;
				font-size: 44rpx;
				font-weight: bolder;
				margin: 20rpx 0;
			}
			.artile_time {
				text-align: center;
				font-size: 30rpx;
				color: #999999;
				margin-bottom: 20rpx;
			}
		}
	}
</style>
