import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/uploadData.vue";
import HeaderMenu from "@/components/layout/HeaderMenu.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "",
      redirect: { name: "receipt" },
    },
    {
      path: "",
      component: HeaderMenu,
      children: [
        {
          path: "/upload",
          name: "upload",
          component: HomeView,
        },
        {
          path: "/receipt",
          name: "receipt",
          component: () => import("../views/receipt.vue"),
        },
      ],
    },
  ],
});

export default router;
