import useAppStore from "@/store/appStore";
// import TripDataView from "@/components/tripData/TripDataView.vue";
import LoginView from "@/components/login/LoginView.vue";
import TripsView from "@/components/trips/TripsView.vue";
import { createRouter, createWebHistory } from "vue-router";
import TripView from "./components/trip/TripView.vue";

export function createAppRouter() {
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
        component: TripView,
      },
    ],
  });

  router.beforeEach((to) => {
    const appStore = useAppStore();

    if (to.name !== "login" && !appStore.isLoggedIn) return { name: "login" };
    if (to.name === "login" && appStore.isLoggedIn) return { name: "trips" };
  });

  return router;
}

export default createAppRouter();
