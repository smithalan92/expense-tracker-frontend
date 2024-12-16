import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import ToastPlugin from "vue-toast-notification";
import { createInstance } from "./api";
import App from "./app/App.vue";
import registerIconLibrary from "./app/fontaweSomeIcons";
import router from "./app/router";
import useAppStore from "./stores/appStore";
import useTripDataStoreSync from "./stores/useTripDataStoreSync";
import "./styles/main.css";
import { BASE_LOCALSTORAGE_KEY } from "./utils/localstorage";

const app = createApp(App);

const pinia = createPinia();
pinia.use(
  createPersistedState({
    key: (id) => `${BASE_LOCALSTORAGE_KEY}__${id}`,
  }),
);

app.use(pinia);
app.use(router);
app.use(ToastPlugin);

registerIconLibrary();
app.component("fa-icon", FontAwesomeIcon);

const appStore = useAppStore();

useTripDataStoreSync();

if (appStore.authToken) {
  createInstance(appStore.authToken);
  appStore.loadAppData();
}

app.mount("#app");
