<template>
	<view class="search_input">
		<navigator url="/pages/search/search" open-type="navigate">搜索</navigator>
	</view>
</template>

<script>
	export default {
		name:"SearchInput",
		data() {
			return {
				
			}
		}
	}
</script>

<style lang="scss">
	.search_input {
		height: 90rpx;
		padding: 15rpx;
		background-color: $zzv-main-color;

		navigator {
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #fff;
			border-radius: 50rpx;
			color: #666;
		}
	}
</style>
