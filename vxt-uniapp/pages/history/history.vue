<!-- 学习记录 -->
<template>
	<view class="content">
		<view class="user-background">
			<view class="user-board">
				<view class="info">
					<view class="user_avatar">
						<u-image mode="widthFix" :src="baseURL + userInfo.header" width="150rpx" height="150rpx"
							shape="circle">
							<u-loading slot="loading"></u-loading>
						</u-image>
					</view>
					<view class="user_info">
						<view class="user_name">
							{{userInfo.nick_name}}
						</view>
						<view class="user_intro">
							{{userInfo.intro}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 我的学习 -->
		<view class="course_list">
			<view class="list_title">
				<u-icon name="list" color="red" size="45"></u-icon>
				<text class="list_title_text">我的学习</text>
			</view>
			<template v-for="(item, index) in userRecord">
				<view class="list_item" @click="navToCourseDetail(item.id)">
					<view class="course_fm">
						<u-image mode="widthFix" border-radius="10" :src="baseURL + item.course_fm_url">
							<u-loading slot="loading"></u-loading>
						</u-image>
						<u-tag text="热门" type="error" shape="circleRight" :show="item.course_is_hot === 1"
							size="mini" />
					</view>
					<view class="course_info">
						<view class="course_info_title">
							{{item.course_title}}
						</view>
						<view class="course_progress_line">
							<u-line-progress active-color="#51b257"
								:percent="(item.learned_count / item.course_outline_count) * 100" :show-percent="true"
								:striped="true" :striped-active="true"></u-line-progress>
						</view>
						<view class="course_progress_count">
							已学习{{item.learned_count}}/{{item.course_outline_count}}课时
						</view>
					</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	let app = getApp()
	import config from '../../config/config.js'
	export default {
		data() {
			return {
				baseURL: config.baseURL,
				userInfo: {}, //用户信息
				userRecord: [], //用户学习记录
			}
		},
		onShow() {
			if (uni.getStorageSync('login')) {
				this.userInfo = uni.getStorageSync('UserInfo')
				this.getLearningRecordList()
			} else {
				uni.showToast({
					title: '请先登录',
					icon: 'none',
					mask: true,
					complete() {
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1500)
					}
				})
			}
		},
		methods: {
			// 获取用户学习历史记录
			getLearningRecordList() {
				this.request({
					url: config.study_history,
					data: {
						user_id: this.userInfo.id
					}
				}).then(result => {
					console.log(result)
					this.userRecord = result.data
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
			.user-background {
				padding: 20rpx 0rpx;
				background-color: $zzv-main-color;

				.user-board {
					width: 90%;
					margin: 0 auto;
					border-radius: 30rpx;
					padding: 40rpx;
					color: #FFFFFF;

					.info {
						display: flex;

						.user_info {
							display: flex;
							flex-direction: column;
							padding-left: 15rpx;
							justify-content: space-around;
							width: 100%;

							.user_name {
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

							.user_intro {
								font-size: 30rpx;
							}
						}
					}
				}
			}

			.course_list {
				width: 94%;
				margin: 0 auto;

				.list_title {
					height: 80rpx;
					line-height: 80rpx;
					font-size: 40rpx;
					font-weight: bolder;

					.list_title_text {
						margin-left: 10rpx;
					}

				}

				.list_item {
					height: 200rpx;
					display: flex;
					width: 100%;

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

						.course_info_title {
							width: 100%;
							font-size: 35rpx;
							font-weight: bolder;
						}

						.course_progress_line {
							font-size: 30rpx;
						}

						.course_progress_count {
							font-size: 30rpx;
							color: #51b257;
						}
					}
				}
			}
		}
	}
</style>
