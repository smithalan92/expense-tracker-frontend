import TripsView from "@/trips/TripsView.vue";
import LoginView from "@/user/LoginView.vue";
import useUserStore from "@/user/userStore";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: {
        name: "login",
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/trips",
      name: "trips",
      component: TripsView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.name !== "login" && !userStore.isLoggedIn) next({ name: "login" });
  else next();
});

export default router;
