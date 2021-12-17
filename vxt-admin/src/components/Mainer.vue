<template>
    <div class="mainer">
        <slot name="main"></slot>
    </div>
</template>

<script>
export default {
    name: "Mainer"
}
</script>

<style lang="less" scoped>
.mainer {
    margin: 0 16px;
}
</style>