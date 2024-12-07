import useAppStore from "@/stores/appStore";
import TripDataView from "@/tripData/TripDataView.vue";
import TripsView from "@/trips/TripsView.vue";
import LoginView from "@/users/LoginView.vue";
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
    {
      path: "/trips/:tripId",
      name: "tripData",
      component: TripDataView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const appStore = useAppStore();

  if (to.name !== "login" && !appStore.isLoggedIn) next({ name: "login" });
  if (to.name === "login" && appStore.isLoggedIn) next({ name: "trips" });
  else next();
});

export default router;
