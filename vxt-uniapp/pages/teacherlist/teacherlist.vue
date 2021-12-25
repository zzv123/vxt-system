<!-- 讲师列表 -->
<template>
	<view class="content">
		<!-- 搜索框 -->
		<SearchInput></SearchInput>
		<!-- 下拉菜单 -->
		<view class="dropdown_menu">
			<u-dropdown>
				<u-dropdown-item v-model="is_star" title="讲师分类" :options="options" @change="getTeacherList(true)">
				</u-dropdown-item>
			</u-dropdown>
		</view>
		<template v-for="(item, index) in teacherList">
			<view class="teacher_item">
				<view class="teacher_avatar">
					<u-image mode="widthFix" border-radius="10" :src="baseURL + item.header" width="150rpx"
						height="150rpx" shape="circle">
						<u-loading slot="loading"></u-loading>
					</u-image>
				</view>
				<view class="teacher_info">
					<view class="teacher_name">
						<text>{{item.name}}</text>
						<u-tag text="星级讲师" type="warning" shape="circle" :show="item.is_star === 1" size="mini" />
					</view>
					<view class="teacher_course">
						<text>课程：{{item.course_count}}门</text>
						<view class="button">
							<u-button type="success" size="mini" plain :ripple="true" @click="navToTeacherDetail(item.id)">
								进入主页</u-button>
						</view>
					</view>
					<view class="teacher_intro">
						{{item.intro}}
					</view>
				</view>
			</view>
		</template>
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
				baseURL: config.baseURL,
				// 讲师数组
				teacherList: [],
				// 分页页码
				page_num: 1,
				// 分页尺度
				page_size: 10,
				// 是否到底
				page_over: false,
				// 是否星级(全部讲师：-1，非星级讲师：0，星级讲师：1)
				is_star: -1,
				options: [{
						label: '全部讲师',
						value: -1,
					},
					{
						label: '普通讲师',
						value: 0,
					},
					{
						label: '星级讲师',
						value: 1,
					}
				]
			}
		},
		onLoad(options) {
			this.getTeacherList(false)
		},
		onReachBottom() {
			if (this.page_over) {
				uni.showToast({
					title: '到底啦~~',
					icon: 'none'
				})
			} else {
				uni.showLoading({
					title: '加载中'
				})
				this.page_num = this.page_num + 1
				this.getTeacherList(false)
			}
		},
		methods: {
			// 获取讲师列表
			getTeacherList(isChange) {
				if (isChange) {
					this.page_num = 1
					this.page_over = false
					this.teacherList = []
				}
				this.request({
					url: config.teacher_list,
					data: {
						page_num: this.page_num,
						page_size: this.page_size,
						is_star: this.is_star
					}
				}).then(result => {
					uni.hideLoading()
					console.log(result)
					if ((result.data.length === 0 || result.data.length < this.page_size) && this.page_num !== 1) {
						this.page_over = true
						uni.showToast({
							title: '到底啦~~',
							icon: 'none'
						})
					}
					this.teacherList = this.teacherList.concat(result.data)
				})
			},
			// 跳转讲师详情页
			navToTeacherDetail(id) {
				uni.navigateTo({
					url: '../teacherdetail/teacherdetail?id=' + id
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $zzv-bg-color;

		.content {
			.dropdown_menu {
				background-color: #FFFFFF;
				width: 96%;
				margin: 0 auto;
				margin-top: 10rpx;
			}

			.teacher_item {
				height: 180rpx;
				display: flex;
				width: 96%;
				margin: 20rpx auto;
				background-color: #FFFFFF;
				padding: 15rpx;
				border-radius: 10rpx;
				box-shadow: 0px 0px 10px #888888;

				.teacher_avatar {
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;

					u-image {
						width: 100%;
					}
				}

				.teacher_info {
					display: flex;
					flex-direction: column;
					padding-left: 15rpx;
					justify-content: space-around;
					width: 100%;

					.teacher_name {
						width: 100%;
						font-size: 35rpx;
						font-weight: bolder;
						display: flex;
						align-items: center;

						u-tag {
							display: flex;
							margin-left: 20rpx;

							.u-tag {
								align-items: center;
							}
						}
					}

					.teacher_course {
						font-size: 30rpx;
						width: 100%;
						display: flex;
						.button {
							flex: 1;
							text-align:right;
						}
					}

					.teacher_intro {
						font-size: 30rpx;
					}
				}
			}
		}
	}
</style>
