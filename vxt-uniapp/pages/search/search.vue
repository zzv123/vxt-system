<template>
	<view class="content">
		<!-- 顶部搜索栏 -->
		<view class="search_bar">
			<u-dropdown>
				<u-dropdown-item v-model="type" :title="title" :options="options" @change="dropdownChange">
				</u-dropdown-item>
			</u-dropdown>
			<u-search v-model="value" @search="search" @custom="search"></u-search>
		</view>
		<!-- 底部搜索结果 -->
		<view class="result_content">
			<!-- 课程搜索结果 -->
			<view class="course_result" v-if="courseResult.length > 0">
				<view class="course_result_title">
					<u-icon name="list" color="red" size="45"></u-icon>
					<text class="title">课程搜索结果</text>
				</view>
				<template v-for="(item, index) in courseResult">
					<view class="course_result_item" @click="navToCourseDetail(item.id)">
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
			<!-- 讲师搜索结果 -->
			<view class="teacher_result" v-if="teacherResult.length > 0">
				<view class="teacher_result_title">
					<u-icon name="account" color="red" size="45"></u-icon>
					<text class="title">讲师搜索结果</text>
				</view>
				<u-grid :border="false" col="3">
					<u-grid-item v-for="(item, index) in teacherResult" :key="index"
						@click="navToTeacherDetail(item.id)">
						<u-image :showLoading="true" :src="baseURL + item.header" width="100rpx" height="100rpx"
							shape="circle">
							<u-loading slot="loading"></u-loading>
						</u-image>
						<text class="grid-text">{{item.name}}</text>
						<text class="grid-text">{{item.position}}</text>
					</u-grid-item>
				</u-grid>
			</view>
			<!-- 文章搜索结果 -->
			<view class="article_result" v-if="articleResult.length > 0">
				<view class="article_result_title">
					<u-icon name="order" color="red" size="45"></u-icon>
					<text class="title">文章搜索结果</text>
				</view>
				<template v-for="(item, index) in articleResult">
					<view class="article_result_item" @click="navToArticleDetail(item.id)">
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
			</view>
		</view>
		<!-- 空状态 -->
		<u-empty text="暂无结果" mode="data"
			v-if="courseResult.length === 0 && teacherResult.length === 0 && articleResult.length === 0"></u-empty>
	</view>
</template>

<script>
	let app = getApp()
	import config from '../../config/config.js'
	import moment from '../../utils/moment.min.js'
	export default {
		data() {
			return {
				baseURL: config.baseURL,
				type: 'search_all',
				title: '全部',
				options: [{
						label: '全部',
						value: 'search_all',
					},
					{
						label: '课程',
						value: 'search_course',
					},
					{
						label: '讲师',
						value: 'search_teacher',
					},
					{
						label: '文章',
						value: 'search_article',
					}
				],
				value: '',
				courseResult: [],
				teacherResult: [],
				articleResult: []
			}
		},
		methods: {
			// 时间处理
			formatTime(time) {
				return moment(time).format('YYYY-MM-DD HH:MM:SS')
			},
			dropdownChange(value) {
				switch (value) {
					case 'search_all':
						this.title = '全部';
						break;
					case 'search_course':
						this.title = '课程';
						break;
					case 'search_teacher':
						this.title = '讲师';
						break;
					case 'search_article':
						this.title = '文章';
						break;
					default:
						this.title = '全部';
						break;
				}
			},
			// 搜索内容
			search() {
				let type = this.type
				uni.showLoading({
					title: '搜索中',
					mask: true
				})
				this.request({
					url: config[type],
					data: {
						key: this.value
					}
				}).then(result => {
					uni.hideLoading()
					console.log(result)
					switch (type) {
						case 'search_all':
							this.courseResult = result.data.courseResult;
							this.teacherResult = result.data.teacherResult;
							this.articleResult = result.data.articleResult;
							break;
						case 'search_course':
							this.courseResult = result.data;
							this.teacherResult = [];
							this.articleResult = [];
							break;
						case 'search_teacher':
							this.teacherResult = result.data;
							this.courseResult = [];
							this.articleResult = [];
							break;
						case 'search_article':
							this.articleResult = result.data;
							this.courseResult = [];
							this.teacherResult = [];
							break;
						default:
							uni.showToast({
								title: '出现错误：没有找到搜索类型',
								mask: true,
								icon: 'none'
							})
							break;
					}
				})
			},
			// 跳转课程详情
			navToCourseDetail(id) {
				uni.navigateTo({
					url: '../coursedetail/coursedetail?id=' + id
				})
			},
			// 跳转讲师详情页
			navToTeacherDetail(id) {
				uni.navigateTo({
					url: '../teacherdetail/teacherdetail?id=' + id
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
			.search_bar {
				background-color: #FFFFFF;
				width: 100%;
				margin: 0 auto;
				display: flex;
				padding-right: 10rpx;

				u-dropdown {
					flex: 3;

					.u-dropdown__content__mask {
						background-color: rgba(0, 0, 0, 0);
					}
				}

				u-search {
					flex: 9;
					display: flex;
					align-items: center;
				}
			}

			.result_content {
				width: 100%;
				background-color: #FFFFFF;
				margin-top: 10rpx;

				.course_result {
					width: 94%;
					margin: 0 auto;

					.course_result_title {
						height: 80rpx;
						line-height: 80rpx;
						font-size: 40rpx;
						font-weight: bolder;

						u-icon {
							margin-left: 10rpx;
						}

						.title {
							margin-left: 10rpx;
						}
					}

					.course_result_item {
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

				.teacher_result {

					.teacher_result_title {
						height: 80rpx;
						line-height: 80rpx;
						font-size: 40rpx;
						font-weight: bolder;

						u-icon {
							margin-left: 10rpx;
						}

						.title {
							margin-left: 10rpx;
						}
					}
				}

				.article_result {
					padding-bottom: 8rpx;

					.article_result_title {
						height: 80rpx;
						line-height: 80rpx;
						font-size: 40rpx;
						font-weight: bolder;

						u-icon {
							margin-left: 10rpx;
						}

						.title {
							margin-left: 10rpx;
						}
					}

					.article_result_item {
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
		}
	}
</style>
