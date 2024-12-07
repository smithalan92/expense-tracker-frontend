import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import ToastPlugin from "vue-toast-notification";
import { createInstance } from "./api";
import App from "./app/App.vue";
import registerIconLibrary from "./app/fontaweSomeIcons";
import router from "./app/router";
import useAppStore from "./stores/appStore";
import "./styles/main.css";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(ToastPlugin);

registerIconLibrary();
app.component("fa-icon", FontAwesomeIcon);

const appStore = useAppStore();

if (appStore.authToken) {
  createInstance(appStore.authToken);
  appStore.loadAppData();
}

app.mount("#app");
