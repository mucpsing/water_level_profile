<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-08-06 19:53:54.088749
 * @Last Modified by: CPS
 * @Last Modified time: 2022-08-06 19:53:54.088749
 * @Filename layout
 * @Description: 项目结构入口
-->

<template>
  <Home />
</template>

<script setup lang="ts">
import Home from "../components/Home.vue";
const ccvb1 = ref("111");
const tes1 = ref(0);
const testt = () => {
  tes1.value = tes1.value + 1;
};
</script>

<style lang="stylus" scoped>
.header {
  @apply m-2
  @apply bg-purple-500
}
</style>
