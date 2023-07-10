<template>
  <div class="home border-2 rounded-lg border-cyan-200 w-[600px] h-[400px] bg-slate-400 flex flex-col">
    <div id="chart-container" class="rounded-md w-full h-full bg-slate-200"></div>
    <!-- <div class="w-full flex flex-row justify-around items-center mt-3">
      <button @click="handleFileUpload">上传文件</button>
      <button @click="downloadImage">下载图片</button>
    </div> -->

    <div class="flex-row justify-start w-full mt-4">
      <var-button class="mx-2" type="primary" auto-loading @click="handleAutoLoadingClick"> 上传文件 </var-button>
      <var-menu class="inline-block" placement="bottom" same-width :offset-y="6">
        <var-button-group type="primary">
          <var-button @click.stop>{{ `sheet选择 (${CURRT_SHEET_ID + 1}/${SHEET_NAMES.length})` }}</var-button>
          <var-button style="padding: 0 6px; border-left: thin solid #1976d2">
            <var-icon name="menu-down" :size="24" />
          </var-button>
        </var-button-group>

        <template #menu>
          <var-cell v-for="(item, index) in SHEET_NAMES" ripple>{{ `${index + 1}、${item}` }}</var-cell>
        </template>
      </var-menu>

      <var-button class="mx-2" type="primary" auto-loading @click="handleAutoLoadingClick"> 图片下载 </var-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import type { EChartsOption, SeriesOption } from "echarts";
import * as echarts from "echarts";
import * as XLSX from "xlsx";

export interface SheetsData {
  names: string[];
  x_coords: number[];
  y_coords: number[];
  tags: string[];
  water_flow: number[];
}

export default defineComponent({
  name: "Home",
  setup() {
    const SHEET_NAMES = ref(["test1", "test2"]);
    const CURRT_SHEET_NAME = ref("");
    const CURRT_SHEET_ID = ref(0);

    const files = ref();
    // 绘制矩形区域
    const drawRect = () => {
      const chartContainer = document.getElementById("chart-container");
      if (chartContainer) {
        const chart = echarts.init(chartContainer);
        const option = {
          xAxis: {},
          yAxis: {},
          series: [
            {
              type: "bar",
              data: [5, 20, 36, 10, 10, 20],
            },
          ],
        };
        chart.setOption(option);
      }
    };

    const handleFileChange = (event: Event) => {
      console.log("进入: handleFileChange");
      const target = event.target as HTMLInputElement;
      const files = target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = handleFileRead;
        reader.readAsArrayBuffer(file);
      }
    };

    const handleFileRead = (event: ProgressEvent<FileReader>) => {
      console.log("进入: handleFileRead");

      if (event.target) {
        console.log("进入: handleFileRead1");
        const data = new Uint8Array(event.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        SHEET_NAMES.value = workbook.SheetNames;

        CURRT_SHEET_NAME.value = workbook.SheetNames[CURRT_SHEET_ID.value];

        const sheet = workbook.Sheets[CURRT_SHEET_NAME.value];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        console.log({ sheet_name: CURRT_SHEET_NAME.value });
        console.log({ jsonData });

        // 处理 jsonData，将数据传递给 echarts 绘制折线图
        // 提取指定列的数据
        const extractDatas = (data: any[], columns: string[]) => {
          const extractedData: any[] = [];
          for (const row of data) {
            const extractedRow: any = {};
            for (const column of columns) {
              extractedRow[column] = row[column];
            }
            extractedData.push(extractedRow);
          }
          return extractedData;
        };

        // 提取指定列的数据
        interface ExtractDataOpts {
          headerRow: number; // 为了保持与pandas读取一直，默认第一行数据为该列标题
        }

        const extractData = (data: any[], column: number | string, opts: ExtractDataOpts = { headerRow: 1 }) => {
          const extractedData: any[] = [];
          let currtIndex = 0;

          for (const row of data) {
            if (opts.headerRow != 0) {
              if (currtIndex < opts.headerRow) {
                currtIndex += 1;
                continue;
              } else {
                currtIndex += 1;
              }
            }

            if (row[column] == undefined) break;
            const extractedValue = row[column];
            extractedData.push(extractedValue);

            currtIndex += 1;
          }
          return extractedData;
        };

        // 绘制折线图
        const drawLineChart = (data: SheetsData) => {
          const chartContainer = document.getElementById("chart-container");
          if (chartContainer) {
            const chart = echarts.init(chartContainer);

            // 根据数据绘制折线图的逻辑...
            // 使用 data 来设置折线图的 x 轴和 y 轴数据
            const y_coords_min = Math.min(...data.y_coords);
            const y_min = parseInt(y_coords_min.toString());
            const y_max = Math.max(...data.y_coords).toFixed();
            // const x_min = parseInt(Math.min(...data.x_coords).toString());
            const x_max = Math.max(...data.x_coords).toFixed();

            // 使用markLine绘制水位线
            const markLineData = data.tags.map((tag, index) => {
              return {
                name: tag,
                yAxis: data.water_flow[index],
              };
            });

            console.log({ markLineData });
            const waterFlowLineList: SeriesOption[] = data.water_flow.map((item) => ({
              z: 1,
              type: "line",
              symbol: "none",
              lineStyle: {
                color: "red",
                width: 1,
              },
              data: data.x_coords.map((x) => item),
            }));

            const waterFlowMinYIndex = data.y_coords.findIndex((e) => e == y_coords_min);

            if (waterFlowMinYIndex == -1) throw "y_coords没有找到最新y坐标";

            const waterFlowMinX = data.x_coords[waterFlowMinYIndex];
            const waterFlowDataList = data.water_flow.map((item) => [waterFlowMinX, item]);

            console.log({ waterFlowMinYIndex });
            console.log({ waterFlowDataList });
            console.log({ y_coords_min });
            console.log({ waterFlowMinX });

            const option: EChartsOption = {
              xAxis: {
                name: "起点距(m)",
                type: "category",
                min: 0,
                max: x_max,
                nameLocation: "center",
                nameGap: 30,
              },
              yAxis: {
                name: "高程(m)",
                nameLocation: "center",
                show: true,
                type: "value",
                min: y_min,
                max: y_max,
                nameGap: 30,
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: "#000",
                    width: 1,
                    type: "solid",
                  },
                },
              },
              series: [
                {
                  type: "scatter",
                  data: waterFlowDataList,
                },
                ...waterFlowLineList,

                // {
                //   smooth: 0.5,
                //   symbol: "none",
                //   data: data.y_coords,
                //   type: "line",
                //   lineStyle: {
                //     color: "#000",
                //     width: 1.5,
                //   },
                //   // markLine: {
                //   //   symbol: "none",
                //   //   data: markLineData,
                //   // },
                //   areaStyle: {
                //     color: "#fff",
                //     opacity: 1,
                //   },
                //   z: 2,
                // },
              ],
            };

            chart.setOption(option);
          }
        };

        const dataDict: SheetsData = {
          // 传入要提取的列名
          names: extractData(jsonData, 0),
          x_coords: extractData(jsonData, 1),
          y_coords: extractData(jsonData, 2),
          tags: extractData(jsonData, 4),
          water_flow: extractData(jsonData, 5),
        };
        console.log({ dataDict });

        drawLineChart(dataDict);
      }
    };

    // 下载图片
    const downloadImage = () => {
      // 将 echarts 绘制的图片转换成 png 并下载
    };

    onMounted(() => {
      // drawRect();
      console.log("组件挂载完成");
    });

    function handleAutoLoadingClick() {
      return new Promise((resolve) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".xlsx"; // 只接受 .xlsx 格式的文件
        fileInput.onchange = handleFileChange;

        fileInput.click();
        setTimeout(resolve, 2000);
      });
    }

    return {
      SHEET_NAMES,
      CURRT_SHEET_NAME,
      CURRT_SHEET_ID,
      downloadImage,
      handleAutoLoadingClick,
      files,
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
