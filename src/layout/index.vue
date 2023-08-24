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
  <div>
    <header>
      <var-app-bar title="开启圆角" title-position="center" round />
    </header>
    <main>
      <EchartsWaterLevel />
    </main>
  </div>
</template>

<script setup lang="ts">
import EchartsWaterLevel from "../components/EchartsWaterLevel/index.vue";
</script>

<style lang="stylus" scoped>
.header {
  @apply m-2
  @apply bg-purple-500
}
</style>
