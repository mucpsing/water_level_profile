/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-07-13 17:20:37
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2023-07-13 17:26:58
 * @FilePath: \duanmianzhexiantu\src\components\EchartsWaterLevel\settings.ts
 * @Description: 本文件属于整个组件的State
 */

import { reactive } from "Vue";

export interface SettingType {
  legend_x: number;
  legend_y: number;
  grid: boolean;
  title: string;
}

export const createSettings = () => {
  return reactive<SettingType>({
    legend_x: 1,
    legend_y: 2,
    grid: false,
    title: "",
  });
};
