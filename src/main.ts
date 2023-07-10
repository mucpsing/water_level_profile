/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2022-08-03 16:48:03
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-07-08 10:19:11
 * @FilePath: \vue3-ts\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from "vue";
import "./style.css";
import "./TailwindCSS.css";

import App from "./App.vue";
import { router } from "./router";

const app = createApp(App);
app.use(router);

app.mount("#app");
