<!-- 我的 -->
<template>
	<view class="content">
		<view class="head">
			<view class="avatar">
				<image :src="baseURL + userInfo.header" v-if="isLogin"></image>
				<image src="../../static/images/avatar.png" v-else></image>
			</view>
			<view class="nickname">
				<text v-if="isLogin">{{userInfo.nick_name}}</text>
				<text v-else>请先登录</text>
			</view>
		</view>
		<view class="body">
			<view class="nav-content">
				<navigator url="../history/history">
					<view class="nav-row">
						<view class="left">
							<u-icon name="order" class="left-ico"></u-icon>
							<text class="left_text">学习记录</text>
						</view>
						<view class="right">
							<u-icon name="arrow-right" class="right_ico" color="#bebebe"></u-icon>
						</view>
					</view>
				</navigator>
				<navigator url="../setting/setting">
					<view class="nav-row">
						<view class="left">
							<u-icon name="setting" class="left-ico"></u-icon>
							<text class="left_text">账号设置</text>
						</view>
						<view class="right">
							<u-icon name="arrow-right" class="right_ico" color="#bebebe"></u-icon>
						</view>
					</view>
				</navigator>
			</view>
		</view>
		<view class="foot">
			<u-button type="success" shape="square" :ripple="true" :custom-style="customStyle" v-if="!isLogin"
				@click="login">立即登录</u-button>
			<u-button type="error" shape="square" :ripple="true" :custom-style="customStyle" v-else @click="show = true">退出登录
			</u-button>
		</view>
		<!-- 模态框 -->
		<u-modal v-model="show" content="您确定要退出登录吗？" :zoom="true" :show-cancel-button="true" @cancel="show = false" @confirm="logout"></u-modal>
	</view>
</template>

<script>
	import config from '../../config/config.js'
	export default {
		data() {
			return {
				baseURL: config.baseURL,
				isLogin: uni.getStorageSync('login'), //是否登录
				customStyle: {
					width: '80%'
				},
				userInfo: {},
				show: false
			}
		},
		onShow() {
			this.userInfo = uni.getStorageSync('UserInfo')
		},
		methods: {
			// 登录
			login() {
				uni.navigateTo({
					url: '../login/login'
				})
			},
			// 登出
			logout() {
				this.isLogin = false
				uni.setStorageSync('UserInfo', {})
				uni.setStorageSync('token', null)
				uni.setStorageSync('login', false)
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F7F7F7;

		.content {
			width: 100%;
			min-height: 100vh;

			.head {
				width: 100%;
				height: 30vh;
				padding-top: 40rpx;
				background-color: $zzv-main-color;

				.avatar {
					width: 200rpx;
					height: 200rpx;
					margin: 0 auto;
					border-radius: 50%;
					overflow: hidden;

					image {
						width: 200rpx;
						height: 200rpx;
						margin: 0 auto;
						border-radius: 50%;
						background-color: #FFFFFF;
					}
				}

				.nickname {
					margin-top: 20rpx;
					text-align: center;
					padding-bottom: 30rpx;
					font-size: 35rpx;
					color: #FFFFFF;
				}
			}

			.body {
				width: 100%;
				height: 40vh;

				.nav-content {
					width: 90%;
					margin: 20rpx auto;
					background-color: #FFF;
					border-radius: 15rpx;
					display: flex;
					flex-direction: column;

					.nav-row {
						width: 100%;
						height: 120rpx;
						border-bottom: 1px solid #f7f7f7;
						display: flex;

						.left {
							flex: 1;
							position: relative;

							.left-ico {
								font-size: 40rpx;
								position: absolute;
								left: 20rpx;
								top: 50%;
								transform: translate(0%, -50%);
							}

							.left_text {
								font-size: 30rpx;
								position: absolute;
								left: 70rpx;
								top: 50%;
								transform: translate(0%, -50%);
								color: #666666;
							}
						}

						.right {
							flex: 1;
							position: relative;

							.right_text {
								font-size: 30rpx;
								position: absolute;
								right: 80rpx;
								top: 50%;
								transform: translate(0%, -50%);
								color: $zzv-font-color;
							}

							.right_ico {
								width: 60rpx;
								height: 60rpx;
								position: absolute;
								right: 0rpx;
								top: 50%;
								transform: translate(0%, -50%);
							}
						}
					}
				}
			}

			.foot {
				width: 100%;
				height: 30vh;

				u-button {
					width: 80%;
				}
			}
		}
	}
</style>
