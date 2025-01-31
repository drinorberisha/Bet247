import { createRouter, createWebHistory } from "vue-router";
import Home from "../Pages/Home.vue";
import Keno from "../Pages/Games/Keno.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/casino/keno",
    name: "Keno",
    component: Keno,
    meta: {
      requiresAuth: false,
      layout: "MainLayout",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
