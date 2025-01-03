import { createRouter, createWebHistory } from "vue-router";
import Index from "./Pages/Index.vue";
import Casino from "./Pages/Casino.vue";
import LiveCasino from "./Pages/LiveCasino.vue";
import Promotions from "./Pages/Promotions.vue";
import DashboardLayout from "./Layouts/DashboardLayout.vue";
import Dashboard from "./Pages/Dashboard/Dashboard.vue";
import BetHistory from "./Pages/Dashboard/BetHistory.vue";
import ContactPreference from "./Pages/Dashboard/ContactPreference.vue";
import Identity from "./Pages/Dashboard/Identity.vue";
import Verification from "./Pages/Dashboard/Verification.vue";
import Casinobet from "./Pages/Dashboard/Casinobet.vue";
import MyPromo from "./Pages/Dashboard/MyPromo.vue";
import Deposit from "./Pages/Dashboard/Deposit.vue";
import Withdraw from "./Pages/Dashboard/Withdraw.vue";
import Transaction from "./Pages/Dashboard/Transaction.vue";
import Notification from "./Pages/Dashboard/Notification.vue";
import Bonuses from "./Pages/Dashboard/Bonuses.vue";
import SportsBetting from "./Pages/SportsBetting.vue";
import NotFound from "./Pages/NotFound.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Index,
      meta: { title: "BET 24/7" },
    },
    {
      path: "/sportsbetting",
      component: SportsBetting,
      meta: { title: "BET 24/7" },
    },
    {
      path: "/casino",
      component: Casino,
      meta: { title: "BET 24/7" },
    },
    {
      path: "/livecasino",
      component: LiveCasino,
      meta: { title: "BET 24/7" },
    },
    {
      path: "/promotions",
      component: Promotions,
      meta: { title: "BET 24/7" },
    },
    {
      path: "/dashboard",
      component: Dashboard,
      meta: {
        layout: DashboardLayout,
        title: "BET 24/7",
      },
    },
    {
      path: "/dashboard/bethistory",
      component: BetHistory,
      meta: {
        layout: DashboardLayout,
        title: "BET 24/7",
      },
    },
    {
      path: "/dashboard/contact-preference",
      component: ContactPreference,
      meta: {
        layout: DashboardLayout,
        title: "BET 24/7",
      },
    },
    {
      path: "/dashboard/identity",
      component: Identity,
      meta: {
        layout: DashboardLayout,
        title: "BET 24/7",
      },
    },
    {
      path: "/dashboard/verification",
      component: Verification,
      meta: {
        layout: DashboardLayout,
        title: "BET 24/7",
      },
    },
    {
      path: "/dashboard/casinobet",
      component: Casinobet,
      meta: {
        layout: DashboardLayout,
        title: "BET 24/7",
      },
    },
    {
      path: "/dashboard/mypromo",
      component: MyPromo,
      meta: {
        layout: DashboardLayout,
        title: "BET 24/7",
      },
    },
    {
      path: "/dashboard/deposit",
      component: Deposit,
      meta: {
        layout: DashboardLayout,
        title: "BET 24/7",
      },
    },
    {
      path: "/dashboard/withdraw",
      component: Withdraw,
      meta: {
        layout: DashboardLayout,
        title: "BET 24/7",
      },
    },
    {
      path: "/dashboard/transaction",
      component: Transaction,
      meta: {
        layout: DashboardLayout,
        title: "BET 24/7",
      },
    },
    {
      path: "/dashboard/notification",
      component: Notification,
      meta: {
        layout: DashboardLayout,
        title: "BET 24/7",
      },
    },
    {
      path: "/dashboard/bonuses",
      component: Bonuses,
      meta: {
        layout: DashboardLayout,
        title: "BET 24/7",
      },
    },

    {
      path: "/:pathMatch(.*)*",
      component: NotFound,
      meta: {
        title: "BET 24/7",
      },
    },
  ],
});
