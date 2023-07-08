<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-08-07 17:32:34.617465
 * @Last Modified by: CPS
 * @Last Modified time: 2022-08-07 17:32:34.617465
 * @Filename header
 * @Description: 功能描述
-->

<template lang="pug">
div(class='bg-red-50 mx-2') {{ test }}
</template>

<script lang="ts" setup>
onMounted(() => {});

const test = ref("test");
</script>
