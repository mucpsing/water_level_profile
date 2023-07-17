/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-07-13 17:20:37
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-07-13 23:51:23
 * @FilePath: \duanmianzhexiantu\src\components\EchartsWaterLevel\settings.ts
 * @Description: 本文件属于整个组件的State
 */

import { reactive } from "vue";

export const showExample = ref(false);
// export const examplePngUrl = "/dataExample.png";

let SETTINGS: SettingType;
export interface SettingType {
  legend_x: number;
  legend_y: number;
  grid: boolean;
  legend: boolean;
  title: string;
  sideTitle: boolean;
  sideTitleX: number;
  sideTitleY: number;
  sideTitleSize: number;
  axisLineWidth: number;
  axisFontSize: number;
}

export const createSettings = () => {
  if (!SETTINGS)
    SETTINGS = reactive<SettingType>({
      legend_x: 1,
      legend_y: 2,
      grid: true,
      legend: true,
      title: "",
      sideTitle: true,
      sideTitleX: 15,
      sideTitleY: 15,
      sideTitleSize: 15,
      axisLineWidth: 1,
      axisFontSize: 12,
    });

  return SETTINGS;
};
