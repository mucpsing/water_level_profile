<template class="flex-row flex">
  <div>
    <header class="rounded-lg my-2">
      <h2 class="rounded-lg border-2 border-cyan-300 bg-slate-300 text-black p-2">{{ CURRT_SHEET_NAME }}</h2>
    </header>

    <div class="home border-2 rounded-lg border-cyan-200 w-[852px] h-[480px] bg-slate-400 flex flex-row">
      <div id="chart-container" class="rounded-md w-full h-full bg-white"></div>
    </div>

    <footer class="flex flex-row justify-center mt-4 gap-2">
      <!-- <var-button type="primary" auto-loading @click="handleAutoLoadingClick"> 打开文件 </var-button> -->
      <var-button type="primary" @click="downloadImage('chart-container')">
        <var-icon name="image-outline" />
        &nbsp;&nbsp;图片下载
      </var-button>

      <var-button-group type="success" size="normal">
        <var-button @click.stop="switchSheetById(CURRT_SHEET_ID - 1)">
          <var-icon name="chevron-left" />
        </var-button>

        <var-button @click="handleAutoLoadingClick">
          <var-icon name="upload" />
          &nbsp;&nbsp;
          {{ `${CURRT_EXCEL_FILE_NAME} (${CURRT_SHEET_ID + 1}/${SHEET_NAMES.length})` }}</var-button
        >

        <var-button @click.stop="switchSheetById(CURRT_SHEET_ID + 1)">
          <var-icon name="chevron-right" />
        </var-button>
      </var-button-group>

      <var-button type="primary" @click="Popupshow = true">
        图片设置 &nbsp;&nbsp;
        <var-icon name="cog" />
      </var-button>

      <var-counter :rules="[(v:any) => v >= 0 || '必须大于10']" v-model="Settings.legend_x" />
      <var-counter :rules="[(v:any) => v >= 0 || '必须大于10']" v-model="Settings.legend_y" />
    </footer>
  </div>
  <var-popup
    :overlay-style="{ backgroundColor: `rgba(255, 255, 255, 0)` }"
    class="w-[260px] p-5"
    :overlay="true"
    position="right"
    v-model:show="Popupshow"
  >
    <var-form ref="form" scroll-to-error="start">
      <var-space direction="column" :size="[20, 10]">
        <var-input placeholder="图片名称" :rules="[(v:any) => !!v || '用户名不能为空']" v-model="Settings.title" />
        <div>
          <var-checkbox v-model="Settings.grid">网格</var-checkbox>
          <var-checkbox v-model="Settings.grid">网格</var-checkbox>
          <var-checkbox v-model="Settings.grid">网格</var-checkbox>
        </div>
        <p class="text-gray-500">
          图例位置x: <var-counter :rules="[(v:any) => v >= 0 || '必须大于10']" v-model="Settings.legend_x" />
        </p>
        <p class="text-gray-500">
          图例位置y: <var-counter :rules="[(v:any) => v >= 0 || '必须大于10']" v-model="Settings.legend_y" />
        </p>

        <var-button class="w-full" type="warning" @click="drawECharts()">
          <var-icon name="image-outline" />
          &nbsp;&nbsp;绘&nbsp;&nbsp;制
        </var-button>
      </var-space>
    </var-form>
  </var-popup>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from "vue";
import * as echarts from "echarts";
import * as XLSX from "xlsx";

import type { ExcelDataList } from "./utils";
import { createEChartsOption, readdExcelFileFromWorkBook } from "./utils";
import { createSettings } from "./settings";

export default defineComponent({
  name: "Home",
  setup() {
    const Settings = createSettings();
    const testData = reactive({ range: 10 });
    const SHEET_NAMES = ref<string[]>([]);
    const CURRT_SHEET_NAME = ref("sheet名称");
    const CURRT_SHEET_ID = ref(0);
    const CURRT_EXCEL_FILE_NAME = ref("打开文件");
    const files = ref();

    let CURRT_OPTIONS: echarts.EChartsOption;
    const Popupshow = ref(false);

    const chartElementID = "chart-container";

    let chartElement: HTMLElement | null = null;
    let EXCEL_DATA_LIST: ExcelDataList = [];

    onMounted(() => {
      chartElement = document.getElementById(chartElementID);

      watch(Settings, (o, n) => {
        console.log({ o, n });
        drawECharts();
      });
    });

    const test = () => {
      drawECharts();
    };

    const switchSheetById = (sheetId: number) => {
      if (sheetId > SHEET_NAMES.value.length - 1) {
        sheetId = 0;
      } else if (sheetId < 0) {
        sheetId = SHEET_NAMES.value.length - 1;
      }

      CURRT_SHEET_ID.value = sheetId;
      CURRT_SHEET_NAME.value = SHEET_NAMES.value[CURRT_SHEET_ID.value];
      drawECharts({ resize: true });
    };

    const handleFileChange = (event: Event) => {
      console.log("进入: handleFileChange");
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
        const option = createEChartsOption(EXCEL_DATA_LIST[CURRT_SHEET_ID.value], Settings);

        const chart = echarts.init(chartElement);

        CURRT_OPTIONS = option;

        chart.setOption(option);

        if (opts.resize) chart.resize();
      }
    };

    const handleFileRead = (event: ProgressEvent<FileReader>) => {
      if (event.target) {
        // 开始绘制
        if (!chartElement) chartElement = document.getElementById(chartElementID);

        if (chartElement) {
          const dataBuffer = new Uint8Array(event.target.result as ArrayBuffer);
          const workbook = XLSX.read(dataBuffer, { type: "array" });

          SHEET_NAMES.value = workbook.SheetNames;
          CURRT_SHEET_NAME.value = SHEET_NAMES.value[CURRT_SHEET_ID.value];
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

      if (!filename)
        filename = `${CURRT_EXCEL_FILE_NAME.value.replace(".xlsx", "").replace(".xls", "")}_${
          CURRT_SHEET_NAME.value
        }.png`;

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
        // setTimeout(resolve, 1500);
      });
    }

    return {
      SHEET_NAMES,
      CURRT_SHEET_NAME,
      CURRT_SHEET_ID,
      CURRT_EXCEL_FILE_NAME,
      downloadImage,
      handleAutoLoadingClick,
      files,
      Popupshow,
      test,
      switchSheetById,
      Settings,
      testData,
      drawECharts,
    };
  },
});
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
