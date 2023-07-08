/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2022-08-07 21:19:53
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2023-07-07 11:10:58
 * @FilePath: \vue3-ts\src\router\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { App } from "vue";
import type { RouteRecordRaw, RouterOptions } from "vue-router";

import Layout from "../layout/index.vue";

// import { routerList } from "./routerList";
import { createRouter, createWebHashHistory } from "vue-router";

const routesList: RouteRecordRaw[] = [
  {
    path: "/",
    component: Layout,
  },
];

const routOptions: RouterOptions = {
  history: createWebHashHistory(),
  routes: routesList,
};

export const router = createRouter(routOptions);

// 挂载路由的函数
export function initRouter(app: App<Element>) {
  app.use(router);
}
