<!-- 用户登录 -->
<template>
	<view class="content">
		<view class="form-box">
			<view class="logo">
				<image src="../../static/images/avatar.png"></image>
			</view>
			<view class="form-item">
				<u-field type="text" icon="account" v-model="account" label="账号" placeholder="请输入账号" clearable>
				</u-field>
			</view>
			<view class="form-item">
				<u-field type="text" icon="lock" v-model="password" label="密码" placeholder="请输入密码" password clearable>
				</u-field>
				<text @click="register" class="register_text">立即注册</text>
			</view>
			<u-button type="success" shape="square" :ripple="true" :custom-style="customStyle" @click="login">立即登录
			</u-button>
		</view>
	</view>
</template>

<script>
	import config from '../../config/config.js'
	export default {
		data() {
			return {
				account: '', //账号
				password: '', //密码
				customStyle: {
					marginTop: '40rpx'
				}
			}
		},
		methods: {
			// 用户注册
			register() {
				uni.navigateTo({
					url: '../register/register'
				})
			},
			// 用户登录
			login() {
				uni.showLoading({
					title: '登录中',
					mask: true
				})
				this.request({
					url: config.user_login,
					method: 'POST',
					data: {
						account: this.account,
						password: this.password
					}
				}).then(result => {
					uni.hideLoading()
					console.log(result)
					if (result.successful) {
						uni.showToast({
							title: '登录成功',
							icon: 'success',
							mask: true,
							complete() {
								uni.setStorageSync('UserInfo', result.data)
								uni.setStorageSync('token', result.data.token)
								uni.setStorageSync('login', true)
								setTimeout(() => {
									uni.reLaunch({
										url: '../mine/mine'
									})
								}, 1500)
							}
						})
					} else {
						uni.showToast({
							title: result.msg,
							icon: 'none',
							mask: true,
							duration: 2000
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: $zzv-bg-color;

		.content {
			.form-box {
				padding-top: 96rpx;
				padding-right: 50rpx;
				padding-left: 50rpx;

				.logo {
					image {
						width: 200rpx;
						height: 200rpx;
						margin: 0 auto;
						display: flex;
						justify-content: center;
						border-radius: 50%;
						overflow: hidden;
					}
				}

				.form-item {
					position: relative;
					background: #fff;
					margin-top: 40rpx;

					.form-item-input {
						display: block;
						width: 100%;
						background: #fff;
						color: #333;
						font-size: 30rpx;
						position: relative;
					}

					.register_text {
						display: inline-block;
						color: #333;
						margin-top: 10rpx;
					}
				}
			}
		}
	}
</style>
