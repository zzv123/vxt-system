<!-- 讲师详情 -->
<template>
	<view class="content">
		<view class="teacher-background">
			<view class="teacher-board">
				<view class="info">
					<view class="teacher_avatar">
						<u-image mode="widthFix" :src="baseURL + teacherDetail.header" width="150rpx" height="150rpx"
							shape="circle">
							<u-loading slot="loading"></u-loading>
						</u-image>
					</view>
					<view class="teacher_info">
						<view class="teacher_name">
							{{teacherDetail.name}}
							<u-tag text="星级讲师" type="warning" shape="circle" :show="teacherDetail.is_star === 1"
								size="mini" />
						</view>
						<view class="teacher_position">
							{{teacherDetail.position}}
						</view>
						<view class="teacher_intro">
							{{teacherDetail.intro}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 发布课程 -->
		<view class="course_list">
			<view class="list_title">
				<u-icon name="list" color="red" size="45"></u-icon>
				<text class="list_title_text">发布课程</text>
			</view>
			<template v-for="(item, index) in teacherDetail.courses">
				<view class="list_item" @click="navToCourseDetail(item.id)">
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
				teacherDetail: {}
			}
		},
		onLoad(options) {
			this.getTeacherDetail(options.id)
		},
		methods: {
			// 获取讲师详情
			getTeacherDetail(id) {
				this.request({
					url: config.teacher_detail + `/${id}`,
				}).then(result => {
					console.log(result)
					this.teacherDetail = result.data
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
			.teacher-background {
				padding: 20rpx 0rpx;
				background-color: $zzv-main-color;

				.teacher-board {
					width: 90%;
					margin: 0 auto;
					border-radius: 30rpx;
					padding: 40rpx;
					color: #FFFFFF;

					.info {
						display: flex;

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

							.teacher_position {
								font-size: 30rpx;
								width: 100%;
							}

							.teacher_intro {
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
	}
</style>
