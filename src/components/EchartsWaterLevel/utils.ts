/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-07-12 15:48:27
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-07-13 01:29:40
 * @FilePath: \duanmianzhexiantu\src\components\EchartsWaterLevel\utils.ts
 * @Description: 一些数据处理的过程和工具函数
 */

import * as XLSX from "xlsx";
import type { WorkBook } from "xlsx";
import type { EChartsOption, SeriesOption } from "echarts";

export interface SheetsData {
  names: string[];
  x_coords: number[];
  y_coords: number[];
  tags: string[];
  water_flow: number[];
  sheet_name: string;
  sheet_id: number;
}

export type ExcelDataList = SheetsData[];

// 提取指定列的数据
export interface ExtractDataOpts {
  headerRow: number; // 为了保持与pandas读取一直，默认第一行数据为该列标题
}

/**
 * @description: 从XELX模块的workbook实例中获取读取数据
 * @param {WorkBook} workbook
 * @return {*}
 */
export const readdExcelFileFromWorkBook = (workbook: WorkBook) => {
  const res: ExcelDataList = workbook.SheetNames.map((sheet_name, sheet_id) => {
    const sheet = workbook.Sheets[sheet_name];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    // console.log(jsonData);

    return {
      // 传入要提取的列名
      names: extractData(jsonData, 0),
      x_coords: extractData(jsonData, 1),
      y_coords: extractData(jsonData, 2),
      tags: extractData(jsonData, 4),
      water_flow: extractData(jsonData, 5),
      sheet_name,
      sheet_id,
    };
  });

  return res;
};

/**
 * @description: 以列的方式，从xlsx模块读取文件后的实例中提取数据
 * @param {any} data
 * @param {number} column_index
 * @param {ExtractDataOpts} opts
 * @return {*}
 */
export const extractData = (data: any[], column_index: number | string, opts: ExtractDataOpts = { headerRow: 1 }) => {
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

    if (row[column_index] == undefined) break;
    const extractedValue = row[column_index];
    extractedData.push(extractedValue);

    currtIndex += 1;
  }
  return extractedData;
};

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

export const createEChartsOption = (data: SheetsData): EChartsOption => {
  console.log(data);

  // 根据数据绘制折线图的逻辑...
  // 使用 data 来设置折线图的 x 轴和 y 轴数据
  const y_coords_min = Math.min(...data.y_coords);
  const y_min = parseInt(y_coords_min.toString());
  const y_max = Math.max(...data.y_coords, ...data.water_flow).toFixed();

  const x_min = 0;
  const x_max = Math.max(...data.x_coords).toFixed();
  const xy_coords = data.y_coords.map((each_y, i) => [data.x_coords[i], each_y]);

  const waterFlowMinYIndex = data.y_coords.findIndex((e) => e == y_coords_min);
  const waterFlowMinX = data.x_coords[waterFlowMinYIndex];

  if (waterFlowMinYIndex == -1) throw "y_coords没有找到最新y坐标";

  // 绘制：【水位线】
  const waterFlowLineList: SeriesOption[] = data.water_flow.map((item) => ({
    z: 1,
    type: "line",
    symbol: "none",
    lineStyle: {
      color: "red",
      width: 1,
    },
    data: data.x_coords.map((x) => [x, item]),
  }));

  // 绘制：【倒三角】
  const waterFlowPointData = data.water_flow.map((water, index) => ({
    x: waterFlowMinX,
    y: water,
    label: data.tags[index],
  }));
  waterFlowPointData.sort((a, b) => b.y - a.y);
  const waterFlowPoint: SeriesOption[] = waterFlowPointData.map((item, index) => {
    let position = "right";
    if (index % 2 == 1) {
      position = "left";
    }
    return {
      type: "scatter",
      symbol: "triangle",
      symbolRotate: 180,
      symbolSize: 12,
      symbolOffset: [0, "-50%"],
      data: [
        {
          value: [item.x, item.y],
          label: {
            show: true,
            formatter: `${item.y} m`,
            color: "black",
            position,
          },
        },
      ],
      color: "blue",
    };
  });

  console.log({ waterFlowMinYIndex });
  console.log({ waterFlowPoint });
  console.log({ y_coords_min });
  console.log({ waterFlowMinX });
  console.log({ x_max });
  console.log({ xy_coords });

  const option: EChartsOption = {
    xAxis: [
      {
        name: "起点距(m)",
        type: "value",
        min: x_min,
        max: x_max,
        data: data.x_coords,
        nameLocation: "middle",
        nameGap: 30,
      },
    ],
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
      ...waterFlowPoint, // 倒三角
      ...waterFlowLineList, // 水位线
      {
        // 断面线
        smooth: 0.1,
        symbol: "none",
        data: xy_coords,
        type: "line",
        lineStyle: {
          color: "#000",
          width: 1.5,
        },
        areaStyle: {
          color: "#fff",
          opacity: 1,
        },
        z: 2,
      },
    ],
  };

  return option;
};
