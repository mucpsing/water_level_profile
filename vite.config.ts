/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2022-08-03 16:48:03
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-07-08 09:55:12
 * @FilePath: \vue3-ts\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import AutoComponents from "unplugin-vue-components/vite";
import { HeadlessUiResolver } from "unplugin-vue-components/resolvers";
import { VarletUIResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  plugins: [
    vue(),

    AutoComponents({
      dts: true,
      // dirs: ["./src/components", "./src/layout"],
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
