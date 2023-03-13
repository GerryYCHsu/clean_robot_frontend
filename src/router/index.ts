import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import Layout from "@/components/layout/Layout.vue"
import DeviceList from "@/components/DeviceList.vue"
import DeviceSetting from "@/components/DeviceSetting.vue"
import CleanConfig from "@/components/CleanConfig.vue"


const routes: RouteRecordRaw[] = [
  {
    path: "/layout",
    name: "layout",
    component: Layout,
    children: [
      {
        path: "devices",
        name: "devices",
        component: DeviceList
      },
      {
        path: "devices-setting/",
        name: "devices-setting",
        props: (route) => ({ defaultRobot: route.query.defaultRobot }),
        component: DeviceSetting
      },
      {
        path: "clean-config/",
        name: "clean-config",
        props: (route) => ({ defaultRobot: route.query.defaultRobot }),
        component: CleanConfig
      },      
    ]
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;
