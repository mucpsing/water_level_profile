import type { RouteRecordRaw, createRouter } from "vue-router";

import { Layout } from "../layout/index.vue";

const baseRouter: RouteRecordRaw = {
  path: "/",
  component: Layout,
};

export const routerListL: RouteRecordRaw[] = [baseRouter];
