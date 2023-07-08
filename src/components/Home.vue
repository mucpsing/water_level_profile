<script lang="ts">
import { defineComponent, onMounted } from "vue";
import * as echarts from "echarts";
import * as XLSX from "xlsx";

export default defineComponent({
  name: "Home",
  setup() {
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

    // 处理文件上传
    const handleFileUpload = () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".xlsx"; // 只接受 .xlsx 格式的文件
      fileInput.onchange = handleFileChange;

      fileInput.click();
    };

    const handleFileChange = (event: Event) => {
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
      if (event.target) {
        const data = new Uint8Array(event.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // 处理 jsonData，将数据传递给 echarts 绘制折线图
        // 提取指定列的数据
        const extractData = (data: any[], columns: string[]) => {
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

        // 绘制折线图
        const drawLineChart = (data: any[]) => {
          const chartContainer = document.getElementById("chart-container");
          if (chartContainer) {
            const chart = echarts.init(chartContainer);

            // 根据数据绘制折线图的逻辑...
            // 使用 data 来设置折线图的 x 轴和 y 轴数据

            const option = {
              // ...
            };

            chart.setOption(option);
          }
        };

        const extractedData = extractData(jsonData, ["x", "y"]); // 传入要提取的列名
        drawLineChart(extractedData);
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

    return {
      handleFileUpload,
      downloadImage,
    };
  },
});
</script>

<template>
  <div class="home">
    <div id="chart-container" style="width: 400px; height: 300px"></div>
    <div class="right">
      <button @click="handleFileUpload">上传文件</button>
      <button @click="downloadImage">下载图片</button>
    </div>
  </div>
</template>

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
