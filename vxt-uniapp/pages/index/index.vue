<!-- 首页 -->
<template>
	<view class="content">
		<!-- 搜索框 -->
		<SearchInput></SearchInput>
		<!-- 轮播图 -->
		<view class="index_swiper">
			<swiper autoplay circular indicator-dots>
				<swiper-item v-for="(item, index) in swiperList" :key="index">
					<u-image mode="widthFix" :src="baseURL + item.ad_url" @click="navToCourseDetail(item.id)">
						<u-loading slot="loading"></u-loading>
					</u-image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 最新文章 -->
		<u-notice-bar type="none" mode="vertical" more-icon="true" :is-circular="false" :list="newsShowList"
			speed="1500" @click="clickNoticeBar" />
		<!-- 导航菜单 -->
		<view class="index_cate">
			<u-grid :border="false" col="4">
				<u-grid-item v-for="(item, index) in menuList" :key="index" @click="navToMenu(item.route)">
					<u-image :show-loading="true" :src='baseURL + `/images/nav/${item.route}.png`' width="100rpx"
						height="100rpx">
						<u-loading slot="loading"></u-loading>
					</u-image>
					<text class="grid-text">{{item.title}}</text>
				</u-grid-item>
			</u-grid>
		</view>
		<!-- 热门好课 -->
		<view class="index_course">
			<view class="index_course_title">
				<u-icon name="thumb-up" color="red" size="45"></u-icon>
				<text class="title">热门好课</text>
				<text class="more" @click="navToCourseList">更多...</text>
			</view>
			<template v-for="(item, index) in courseList">
				<view class="index_course_content" @click="navToCourseDetail(item.id)">
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
		<!-- 明星讲师 -->
		<view class="index_teacher">
			<view class="index_teacher_title">
				<u-icon name="account" color="red" size="45"></u-icon>
				<text class="title">明星讲师</text>
				<text class="more" @click="navToTeacherList">更多...</text>
			</view>
			<u-grid :border="false" col="3">
				<u-grid-item v-for="(item, index) in teacherList" :key="index" @click="navToTeacherDetail(item.id)">
					<u-image :showLoading="true" :src="baseURL + item.header" width="100rpx" height="100rpx"
						shape="circle">
						<u-loading slot="loading"></u-loading>
					</u-image>
					<text class="grid-text">{{item.name}}</text>
					<text class="grid-text">{{item.position}}</text>
				</u-grid-item>
			</u-grid>
		</view>
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
				// 轮播图数组
				swiperList: [],
				// 导航菜单数组
				menuList: [],
				// 学院新闻数组
				newsList: [],
				// 热门好课数组
				courseList: [],
				// 明星讲师数组
				teacherList: []
			}
		},
		computed: {
			newsShowList() {
				let arr = []
				this.newsList.forEach(e => {
					arr.push(e.title)
				})
				return arr
			}
		},
		onLoad(options) {
			this.getSwiperList()
			this.getNewsList()
			this.getMenuList()
			this.getCourseList()
			this.getTeacherList()
		},
		onPullDownRefresh() {
			uni.showNavigationBarLoading()
			this.getSwiperList()
			this.getNewsList()
			this.getMenuList()
			this.getCourseList()
			this.getTeacherList()
		},
		methods: {
			// 获取轮播图列表
			getSwiperList() {
				this.request({
					url: config.focus_img
				}).then(result => {
					console.log(result)
					this.swiperList = result.data
				})
			},
			// 获取新闻列表
			getNewsList() {
				this.request({
					url: config.last_news
				}).then(result => {
					console.log(result)
					this.newsList = result.data
				})
			},
			// 获取导航菜单列表
			getMenuList() {
				this.request({
					url: config.nav_menu
				}).then(result => {
					console.log(result)
					result.data[0].route = '/index'
					this.menuList = result.data
				})
			},
			// 获取热门好课列表
			getCourseList() {
				this.request({
					url: config.hot_course
				}).then(result => {
					console.log(result)
					this.courseList = result.data
				})
			},
			// 获取明星讲师列表
			getTeacherList() {
				this.request({
					url: config.star_teacher
				}).then(result => {
					console.log(result)
					this.teacherList = result.data
					// 加载完成，停止下拉刷新
					uni.hideNavigationBarLoading()
					uni.stopPullDownRefresh()
				})
			},
			// 跳转文章详情
			clickNoticeBar(index) {
				let id = this.newsList[index].id
				uni.navigateTo({
					url: '../articledetail/articledetail?id=' + id
				})
			},
			// 导航栏跳转
			navToMenu(prams) {
				let path = prams + 'list'
				if (path === '/indexlist') {
					console.log('跳转首页');
				} else {
					uni.navigateTo({
						url: '..' + path + path
					})
				}
			},
			// 跳转课程列表
			navToCourseList() {
				uni.navigateTo({
					url: '../courselist/courselist'
				})
			},
			// 跳转讲师列表
			navToTeacherList() {
				uni.navigateTo({
					url: '../teacherlist/teacherlist'
				})
			},
			// 跳转讲师详情
			navToTeacherDetail(id) {
				uni.navigateTo({
					url: '../teacherdetail/teacherdetail?id=' + id
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
	.content {
		.index_swiper {
			swiper {
				width: 100%;
				height: 274rpx;

				image {
					width: 100%;
				}
			}
		}

		.index_cate {
			border-top: 1rpx solid $zzv-border-color;
			border-bottom: 1rpx solid $zzv-border-color;
		}

		.index_course {
			width: 94%;
			margin: 0 auto;

			.index_course_title {
				height: 80rpx;
				line-height: 80rpx;
				font-size: 40rpx;
				font-weight: bolder;

				.title {
					margin-left: 10rpx;
				}

				.more {
					float: right;
					font-size: 30rpx;
				}
			}

			.index_course_content {
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

		.index_teacher {
			width: 94%;
			margin: 0 auto;

			.index_teacher_title {
				height: 80rpx;
				line-height: 80rpx;
				font-size: 40rpx;
				font-weight: bolder;

				.title {
					margin-left: 10rpx;
				}

				.more {
					float: right;
					font-size: 30rpx;
				}
			}
		}
	}
</style>
