<script>
	const api = require("config/config.js")
	export default {
		// 全局数据
		globalData: {},
		onLaunch: function() {
			// #ifdef MP-WEIXIN
			// 小程序主动更新
			this.updateManager()
			// #endif
		},
		onShow: function() {

		},
		onHide: function() {

		},
		methods: {
			// 小程序更新
			updateManager() {
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(res => {
					// 请求完新版本信息的回调
					// console.log(res.hasUpdate)
				})
				updateManager.onUpdateReady(() => {
					uni.showModal({
						title: '更新提示',
						content: '新版本已经准备好，即将重启应用',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate()
							}
						}
					})
				})
				updateManager.onUpdateFailed(() => {
					// 新的版本下载失败
					uni.showModal({
						title: '更新提示',
						content: '新版本下载失败',
						showCancel: false
					})
				})
			},
			// 功能未发布提示
			showUnpublishedModel() {
				uni.showModal({
					title: '提示',
					content: '该功能尚未发布',
					showCancel: false
				})
			},
			// 网络请求错误提示
			showRequestErrorModel() {
				uni.showModal({
					title: '提示',
					content: '网络请求错误',
					showCancel: false
				})
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
	@import url("./styles/normalize.css");
	@import url("./styles/iconfont.css");
</style>
