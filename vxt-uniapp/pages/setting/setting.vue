<template>
	<view class="content">
		<view class="form-box">
			<u-form :model="userForm" ref="uForm" label-width="130">
				<u-form-item label="头像" left-icon="camera">
					<u-avatar :src="baseURL + userForm.header" img-mode="widthFix" @click="chooseAvatar"></u-avatar>
				</u-form-item>
				<u-form-item label="账号" left-icon="account">
					<u-input v-model="userForm.account" disabled />
				</u-form-item>
				<u-form-item label="昵称" left-icon="gift">
					<u-input v-model="userForm.nick_name" />
				</u-form-item>
				<u-form-item label="简介" left-icon="chat">
					<u-input v-model="userForm.intro" />
				</u-form-item>
				<u-form-item label="密码" left-icon="lock" right-icon="arrow-right">
					<view class="from_item">
						<text class="from_item_left">******</text>
						<text class="from_item_right" @click="show = true">点击修改</text>
					</view>
				</u-form-item>
			</u-form>
		</view>
		<u-button type="success" shape="square" :ripple="true" :custom-style="customStyle" @click="submit">更新信息
		</u-button>
		<!-- 弹出层 -->
		<u-popup v-model="show" mode="center" border-radius="14">
			<view class="popup">
				<view class="popup_title">
					修改密码
				</view>
				<u-form :model="passFrom" ref="uForm" label-width="130">
					<u-form-item label="旧密码">
						<u-input type="password" password-icon v-model="passFrom.password" placeholder="请输入旧密码" />
					</u-form-item>
					<u-form-item label="新密码">
						<u-input type="password" password-icon v-model="passFrom.new_password" placeholder="请输入新密码" />
					</u-form-item>
				</u-form>
				<view class="popup_foot">
					<u-button :ripple="true" :custom-style="popupStyle" @click="show = false">取消</u-button>
					<u-button type="success" :ripple="true" :custom-style="popupStyle" @click="submitModifyPassword">确定
					</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import config from '../../config/config.js'
	export default {
		data() {
			return {
				baseURL: config.baseURL,
				show: false,
				userForm: {},
				passFrom: {
					password: '',
					new_password: ''
				},
				customStyle: {
					width: '80%',
					marginTop: '40rpx'
				},
				popupStyle: {
					marginTop: '20rpx'
				}
			}
		},
		created() {
			// 监听从裁剪页发布的事件，获得裁剪结果
			uni.$on('uAvatarCropper', path => {
				this.avatar = path;
				// 可以在此上传到服务端
				uni.showLoading({
					title: '头像上传中',
					mask: true
				})
				uni.uploadFile({
					url: config.update_header,
					filePath: path,
					fileType: 'image',
					name: 'header',
					header: {
						token: uni.getStorageSync('token')
					},
					formData: {
						user_id: this.userForm.id
					},
					complete: (res) => {
						uni.hideLoading()
						console.log(res)
						let result = JSON.parse(res.data)
						console.log(result)
						if (result.successful) {
							uni.showToast({
								title: result.msg,
								icon: 'success',
								mask: true,
								duration: 2000
							})
							uni.setStorageSync('UserInfo', result.data)
							this.userForm = uni.getStorageSync('UserInfo')
						} else {
							uni.showToast({
								title: result.msg,
								icon: 'none',
								mask: true,
								duration: 2000
							})
						}
					}
				})
			})
		},
		onShow() {
			if (uni.getStorageSync('login')) {
				this.userForm = uni.getStorageSync('UserInfo')
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
			// 选择头像
			chooseAvatar() {
				// 此为uView的跳转方法，详见"文档-JS"部分，也可以用uni的uni.navigateTo
				this.$u.route({
					url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
					// 内部已设置以下默认参数值，可不传这些参数
					params: {
						// 输出图片宽度，高等于宽，单位px
						destWidth: 300,
						// 裁剪框宽度，高等于宽，单位px
						rectWidth: 200,
						// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
						fileType: 'jpg',
					}
				})
			},
			// 提交更新信息
			submit() {
				let that = this
				uni.showLoading({
					title: '提交中',
					mask: true
				})
				that.request({
					url: config.update_info,
					method: 'POST',
					data: {
						user_id: that.userForm.id,
						nick_name: that.userForm.nick_name,
						intro: that.userForm.intro
					}
				}).then(result => {
					uni.hideLoading()
					console.log(result)
					if (result.successful) {
						uni.showToast({
							title: result.msg,
							icon: 'success',
							mask: true,
							complete() {
								uni.setStorageSync('UserInfo', result.data)
								that.userForm = uni.getStorageSync('UserInfo')
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
			},
			// 提交修改密码
			submitModifyPassword() {
				let that = this
				uni.showLoading({
					title: '提交中',
					mask: true
				})
				that.request({
					url: config.update_password,
					method: 'POST',
					data: {
						account: that.userForm.account,
						password: that.passFrom.password,
						new_password: that.passFrom.new_password
					}
				}).then(result => {
					uni.hideLoading()
					console.log(result)
					if (result.successful) {
						uni.showToast({
							title: result.msg,
							icon: 'success',
							mask: true
						})
						this.passFrom.password = ''
						this.passFrom.new_password = ''
						this.show = false
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

<style lang="scss">
	page {
		.content {
			min-height: 100vh;

			.form-box {
				width: 90%;
				margin: 0 auto;

				.from_item {
					width: 100%;
					height: 100%;

					.from_item_right {
						float: right;
						color: red;
					}
				}
			}

			.popup {
				padding: 30rpx;
				width: 600rpx;

				.popup_title {
					font-size: 35rpx;
				}

				.popup_foot {
					display: flex;
					justify-content: space-around;
				}
			}
		}
	}
</style>
