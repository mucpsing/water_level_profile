/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2022-08-03 16:48:03
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2023-07-17 16:29:05
 * @FilePath: \vue3-ts\vite.config.ts
 * @Description: 当本项目位于gis-api中编译时使用本配置文件，主要是修正bzse
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import AutoComponents from "unplugin-vue-components/vite";
import { HeadlessUiResolver } from "unplugin-vue-components/resolvers";
import { VarletUIResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  base: "static/view/water_level",
  server: {
    host: "0.0.0.0",
  },
  plugins: [
    vue(),

    AutoComponents({
      dts: true,
      dirs: [],
      directoryAsNamespace: true, // 开启命名空间（目录名+组件名）
      extensions: ["vue"],
      resolvers: [HeadlessUiResolver(), VarletUIResolver()], // 自动导入 headless
    }),

    AutoImport({
      dirs: [],
      dts: "./src/auto-imports.d.ts",
      resolvers: [VarletUIResolver()],
      imports: [
        "vue",
        "vue-router",
        {
          // 引入axios
          axios: [
            // default imports
            ["default", "axios"], // import { default as axios } from 'axios',
          ],
        },
      ],
    }),
  ],
});
