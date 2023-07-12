<template>
  <div>
    <header class="rounded-lg my-2">
      <h2 class="rounded-lg border-2 border-cyan-300 bg-slate-300 text-black p-2">{{ CURRT_SHEET_NAME }}</h2>
    </header>

    <div class="home border-2 rounded-lg border-cyan-200 w-[800px] h-[420px] bg-slate-400 flex flex-row">
      <div id="chart-container" class="rounded-md w-full h-full bg-white"></div>
    </div>

    <footer class="flex flex-row justify-center mt-4 gap-2">
      <!-- <var-button type="primary" auto-loading @click="handleAutoLoadingClick"> 打开文件 </var-button> -->
      <var-button type="primary" @click="handleAutoLoadingClick">
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
    </footer>
  </div>
  <var-popup v-model:show="Popupshow">
    <div class="popup-example-block">
      素胚勾勒出青花笔锋浓转淡, 瓶身描绘的牡丹一如你初妆, 冉冉檀香透过窗心事我了然, 宣纸上走笔至此搁一半。
    </div>
  </var-popup>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import * as echarts from "echarts";
import * as XLSX from "xlsx";

import type { ExcelDataList } from "./utils";
import { createEChartsOption, readdExcelFileFromWorkBook } from "./utils";
import Setting from "./setting.vue";

export default defineComponent({
  name: "Home",
  setup() {
    const SHEET_NAMES = ref<string[]>([]);
    const CURRT_SHEET_NAME = ref("sheet名称");
    const CURRT_SHEET_ID = ref(0);
    const CURRT_EXCEL_FILE_NAME = ref("打开文件");
    const files = ref();

    const Popupshow = ref(false);

    const chartElementID = "chart-container";

    let chartElement: HTMLElement | null = null;
    let EXCEL_DATA_LIST: ExcelDataList = [];

    onMounted(() => {
      chartElement = document.getElementById(chartElementID);
    });

    const test = (e: any, i: any) => {
      console.log("test");
      console.log({ e, i });
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
        const option = createEChartsOption(EXCEL_DATA_LIST[CURRT_SHEET_ID.value]);

        const chart = echarts.init(chartElement);

        chart.setOption(option);

        if (opts.resize) {
          chart.resize();
        }
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

    // 下载图片
    const downloadImage = () => {
      // 将 echarts 绘制的图片转换成 png 并下载
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
