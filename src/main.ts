import { createInstance } from "@/api/axios.ts";
import router from "@/router";
import useAppStore from "@/store/appStore.ts";
import useTripDataStoreSync from "@/store/useTripDataStoreSync.ts";
import { BASE_LOCALSTORAGE_KEY } from "@/utils/localstorage.ts";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

const app = createApp(App);

const pinia = createPinia();
pinia.use(
  createPersistedState({
    key: (id) => `${BASE_LOCALSTORAGE_KEY}__${id}`,
  }),
);

app.use(pinia);
app.use(router);

const appStore = useAppStore();

useTripDataStoreSync();

if (appStore.authToken) {
  createInstance(appStore.authToken);
  appStore.loadAppData();
}

app.mount("#app");
