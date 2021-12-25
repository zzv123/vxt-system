<!-- 课程列表 -->
<template>
	<view class="content">
		<!-- 搜索框 -->
		<SearchInput></SearchInput>
		<!-- 选项卡 -->
		<u-tabs :list="course_category_list" :is-scroll="true" name="title" :current="current" @change="tabChange">
		</u-tabs>
		<!-- 课程列表 -->
		<template v-for="(item, index) in course_list">
			<view class="course_item" @click="navToCourseDetail(item.id)">
				<view class="course_fm">
					<u-image mode="widthFix" border-radius="10" :src="baseURL + item.fm_url">
						<u-loading slot="loading"></u-loading>
					</u-image>
					<u-tag text="热门" type="error" shape="circleRight" :show="item.is_hot === 1" size="mini" />
				</view>
				<view class="course_info">
					<view class="course_title">
						{{item.title}}
					</view>
					<view class="course_star">
						<u-rate :count="5" v-model="item.comment_avg_score" :disabled="true"></u-rate>
					</view>
					<view class="course_praise">
						<u-icon name="thumb-up" color="red" size="35"></u-icon>{{item.comment_total_count}}人好评
					</view>
				</view>
			</view>
		</template>
		<!-- 空状态 -->
		<u-empty text="暂无结果" mode="data" v-if="course_list.length === 0"></u-empty>
	</view>
</template>

<script>
	let app = getApp()
	import SearchInput from '../../components/SearchInput/SearchInput.vue'
	import config from '../../config/config.js'
	export default {
		components: {
			SearchInput
		},
		data() {
			return {
				baseURL: config.baseURL,
				// 课程数组
				course_list: [],
				// 分页页码
				page_num: 1,
				// 分页尺度
				page_size: 10,
				// 是否到底
				page_over: false,
				// 课程分类
				course_category_list: [],
				// 当前选中tab
				current: 0
			}
		},
		onLoad(options) {
			this.getCourseCategory()
		},
		methods: {
			// 获取课程分类
			getCourseCategory() {
				this.request({
					url: config.course_category
				}).then(result => {
					console.log(result)
					this.course_category_list = result.data
					let category_id = this.course_category_list[this.current].id
					this.getCourseList(category_id)
				})
			},
			// tab改变
			tabChange(index) {
				this.current = index
				let category_id = this.course_category_list[this.current].id
				this.page_num = 1
				this.page_over = false
				this.course_list = []
				this.getCourseList(category_id)
			},
			// 获取课程列表
			getCourseList(category_id) {
				this.request({
					url: config.course_list,
					data: {
						page_num: this.page_num,
						page_size: this.page_size,
						category_id: category_id
					}
				}).then(result => {
					console.log(result)
					if ((result.data.length === 0 || result.data.length < this.page_size) && this.page_num !== 1) {
						this.page_over = true
						uni.showToast({
							title: '到底啦~~',
							icon: 'none'
						})
					}
					this.course_list = this.course_list.concat(result.data)
				})
			},
			// 跳转课程详情
			navToCourseDetail(id) {
				uni.navigateTo({
					url: '../coursedetail/coursedetail?id=' + id
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		.content {
			.course_item {
				height: 200rpx;
				display: flex;
				width: 96%;
				margin: 20rpx auto;

				.course_fm {
					flex: 2;
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;

					u-image {
						width: 100%;
					}

					.u-tag {
						position: absolute;
						top: 19rpx;
						left: 0;
					}
				}

				.course_info {
					flex: 3;
					display: flex;
					flex-direction: column;
					padding-left: 15rpx;
					padding-top: 10rpx;
					padding-bottom: 18rpx;
					justify-content: space-around;

					.course_title {
						width: 100%;
						font-size: 35rpx;
						font-weight: bolder;
					}

					.course_star {
						font-size: 30rpx;
					}

					.course_praise {
						font-size: 30rpx;
					}
				}
			}
		}
	}
</style>
