<template class="flex-row flex">
  <div class="">
    <header class="rounded-lg my-2">
      <h2 class="rounded-lg border-2 border-cyan-300 bg-slate-300 text-black p-2">{{ CURRT_SHEET_NAME }}</h2>
    </header>

    <div class="border-2 rounded-lg border-cyan-200 w-[852px] h-[480px] bg-slate-400 flex flex-row">
      <div id="chart-container" class="relative rounded-md w-full h-full bg-white">
        <div class="absolute top-0 left-1/2 translate-x-[-50%]">
          <var-image @click="showExample = true" class="cursor-pointer" height="420" :src="ExampleImgUrl" />
          <var-button class="w-full top-3" type="warning" @click="showExample = true">
            <var-icon name="help-circle-outline" />
            &nbsp;&nbsp;Excel数据格式要求&nbsp;&nbsp;
            <var-icon name="help-circle-outline" />
          </var-button>
        </div>
      </div>
    </div>

    <footer class="flex flex-row justify-center mt-4 gap-2">
      <var-button type="primary" @click="downloadImage('chart-container')">
        <var-icon name="download" />
        &nbsp;&nbsp;图片下载
      </var-button>

      <var-button-group type="success" size="normal">
        <var-button @click.stop="switchSheetById(CURRT_SHEET_ID - 1)">
          <var-icon name="chevron-left" />
        </var-button>

        <var-button @click="handleAutoLoadingClick">
          <var-icon name="file-document-outline" />
          &nbsp;&nbsp;
          {{ `${CURRT_EXCEL_FILE_NAME} (${CURRT_SHEET_ID + 1}/${SHEET_NAMES.length})` }}</var-button
        >

        <var-button @click.stop="switchSheetById(CURRT_SHEET_ID + 1)">
          <var-icon name="chevron-right" />
        </var-button>
      </var-button-group>

      <var-button type="primary" @click="Popupshow = true">
        绘图设置 &nbsp;&nbsp;
        <var-icon name="cog" />
      </var-button>
    </footer>
  </div>

  <!-- 设置菜单使用弹出组件进行包裹 -->
  <var-popup
    :overlay-style="{ backgroundColor: `rgba(255, 255, 255, 0)` }"
    class="w-[260px] p-5"
    :overlay="true"
    position="right"
    v-model:show="Popupshow"
  >
    <SettingsComponent />
  </var-popup>

  <var-image-preview closeable :images="images" v-model:show="showExample" @long-press="Snackbar('触发了长按事件')" />
</template>

<script lang="ts" setup>
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  GraphicComponent,
} from "echarts/components";
import { ScatterChart, BarChart, LineChart } from "echarts/charts";
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from "echarts/features";

// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";

import { read as xlsxRead } from "xlsx";
import { Snackbar } from "@varlet/ui";

import { createEChartsOption, readdExcelFileFromWorkBook } from "./utils";
import { createSettings, showExample } from "./state";
import SettingsComponent from "./settings.vue";

import ExampleImgUrl from "../../assets/dataExample.png";

import type { ExcelDataListT } from "./utils";
import type { EChartsOption } from "echarts";

echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  ScatterChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  GraphicComponent,
]);

const images = ref([ExampleImgUrl]);

const Settings = createSettings();
const SHEET_NAMES = ref<string[]>([]);
const CURRT_SHEET_NAME = ref("点击绿色按钮读取Excel文件");
const CURRT_SHEET_ID = ref(0);
const CURRT_EXCEL_FILE_NAME = ref("选择Excel文件");
const Popupshow = ref(false);

let EXCEL_DATA_LIST: ExcelDataListT = [];
let CURRT_OPTIONS: EChartsOption;
let chartElement: HTMLElement | null = null;

const chartElementID = "chart-container";

onMounted(() => {
  chartElement = document.getElementById(chartElementID);

  // 每次修改配置自动更新图像
  watch(Settings, (o, n) => drawECharts());
});

const switchSheetById = (sheetId: number) => {
  if (sheetId > SHEET_NAMES.value.length - 1) {
    sheetId = 0;
  } else if (sheetId < 0) {
    sheetId = SHEET_NAMES.value.length - 1;
  }

  CURRT_SHEET_ID.value = sheetId;
  CURRT_SHEET_NAME.value = SHEET_NAMES.value[CURRT_SHEET_ID.value];
  Settings.title = `${CURRT_EXCEL_FILE_NAME.value.replace(".xlsx", "").replace(".xls", "")}_${
    CURRT_SHEET_NAME.value
  }.png`;
  drawECharts({ resize: true });
};

const handleFileChange = (event: Event) => {
  console.log("打开文件");
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    const file = files[0];

    if (CURRT_EXCEL_FILE_NAME.value != file.name) {
      CURRT_EXCEL_FILE_NAME.value = file.name;
      CURRT_SHEET_ID.value = 0;
    }

    const reader = new FileReader();
    reader.onload = handleFileRead;
    reader.readAsArrayBuffer(file);
  }
};

const drawECharts = (opts: { resize: boolean } = { resize: false }) => {
  if (!chartElement) chartElement = document.getElementById(chartElementID);

  if (chartElement) {
    CURRT_OPTIONS = createEChartsOption(EXCEL_DATA_LIST[CURRT_SHEET_ID.value], Settings);

    const chart = echarts.init(chartElement);

    chart.setOption(CURRT_OPTIONS);

    if (opts.resize) chart.resize();
  }
};

const handleFileRead = (event: ProgressEvent<FileReader>) => {
  if (event.target) {
    // 开始绘制
    if (!chartElement) chartElement = document.getElementById(chartElementID);

    if (chartElement) {
      const dataBuffer = new Uint8Array(event.target.result as ArrayBuffer);
      const workbook = xlsxRead(dataBuffer, { type: "array" });

      SHEET_NAMES.value = workbook.SheetNames;
      CURRT_SHEET_NAME.value = SHEET_NAMES.value[CURRT_SHEET_ID.value];
      Settings.title = `${CURRT_EXCEL_FILE_NAME.value.replace(".xlsx", "").replace(".xls", "")}_${
        CURRT_SHEET_NAME.value
      }.png`;

      EXCEL_DATA_LIST = readdExcelFileFromWorkBook(workbook);

      drawECharts();
    }
  }
};

// 将 echarts 绘制的图片转换成 png 并下载
const downloadImage = (chartElementId: string, filename: string = "") => {
  const chartContainer = document.getElementById(chartElementId);
  if (!chartContainer) return console.log("获取chart实例失败: ", chartElementId);

  const chart = echarts.getInstanceByDom(chartContainer);

  if (!chart) return console.log("导出图片出错，getInstanceByDom()失败");

  // 将图表转换为 base64 编码的图像数据
  const imageDataURL = chart.getDataURL({ type: "png", pixelRatio: 2 });

  // 创建虚拟的下载链接
  const link = document.createElement("a");
  link.href = imageDataURL;

  if (!filename) filename = Settings.title;

  if (filename.endsWith(".png")) filename = `${filename}.png`;
  link.download = filename;

  // 设置下载属性
  link.style.display = "none";
  document.body.appendChild(link);

  // 模拟点击链接触发下载
  link.click();

  // 清理并移除链接
  document.body.removeChild(link);
};

function handleAutoLoadingClick() {
  return new Promise((resolve) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".xlsx;.xls"; // 只接受 .xlsx 格式的文件
    fileInput.onchange = handleFileChange;

    fileInput.click();
  });
}
</script>

<style scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}

.right {
  display: flex;
  gap: 10px;
}
</style>
