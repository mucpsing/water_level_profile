<template>
  <var-form ref="form" scroll-to-error="start">
    <var-space direction="column" :size="[20, 10]">
      <var-input placeholder="图片名称" :rules="[(v:any) => !!v || '用户名不能为空']" v-model="Settings.title" />
      <div>
        <var-checkbox v-model="Settings.grid">网格</var-checkbox>
        <var-checkbox v-model="Settings.legend">图例</var-checkbox>
      </div>
      <p><strong>图例位置</strong></p>
      <p class="text-gray-500">
        X: <var-counter :rules="[(v:any) => v >= 0 || '必须大于10']" v-model="Settings.legend_x" />
      </p>
      <p class="text-gray-500">
        Y: <var-counter :rules="[(v:any) => v >= 0 || '必须大于10']" v-model="Settings.legend_y" />
      </p>

      <p><strong>左右岸标签</strong></p>
      <p class="text-gray-500">
        X: <var-counter :rules="[(v:any) => v >= 0 || '必须大于10']" v-model="Settings.sideTitleX" />
      </p>
      <p class="text-gray-500">
        Y: <var-counter :rules="[(v:any) => v >= 0 || '必须大于10']" v-model="Settings.sideTitleY" />
      </p>
      <p class="text-gray-500">
        字体大小: <var-counter :rules="[(v:any) => v >= 0 || '必须大于10']" v-model="Settings.sideTitleSize" />
      </p>

      <p><strong>坐标轴</strong></p>
      <p class="text-gray-500">
        字体大小: <var-counter :rules="[(v:any) => v >= 0 || '必须大于10']" v-model="Settings.axisFontSize" />
      </p>
      <p class="text-gray-500">
        线粗: <var-counter :rules="[(v:any) => v >= 0 || '必须大于10']" v-model="Settings.axisLineWidth" />
      </p>

      <var-button class="w-full" type="warning" @click="showExample = true">
        <var-icon name="help-circle-outline" />
        &nbsp;&nbsp;Excel数据格式要求&nbsp;&nbsp;
        <var-icon name="help-circle-outline" />
      </var-button>
    </var-space>
  </var-form>
</template>

<script lang="ts" setup>
import { createSettings, showExample } from "./state";

const Settings = createSettings();
</script>

<style lang="" scoped></style>
