<template>
	<view>
		课程详情--{{id}}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0
			}
		},
		onLoad(options) {
			this.id = options.id
		}
	}
</script>

<style lang="scss">

</style>
