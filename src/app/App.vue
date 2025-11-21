<script setup lang="ts">
import useAppStore from "@/stores/appStore";
import useUserPreferencesStore from "@/stores/userPreferencesStore";
import { onBeforeMount, watch } from "vue";
import { RouterView, useRouter } from "vue-router";
import Header from "./Header.vue";
import PWAUpdateAlert from "./PWAUpdateAlert.vue";

const appStore = useAppStore();
const userPreferencesStore = useUserPreferencesStore();
const router = useRouter();

watch(
  () => appStore.isLoggedIn,
  (currentValue, previousValue) => {
    if (previousValue && !currentValue) {
      router.push({ name: "login" });
    }
  },
);

watch(
  () => userPreferencesStore.useAlternativeUI,
  (currentValue) => {
    let themeName = "cupcake";
    if (currentValue) {
      themeName = "business";
    }

    document.querySelector("html")!.setAttribute("data-theme", themeName);
  },
);

onBeforeMount(() => {
  if (userPreferencesStore.useAlternativeUI) {
    document.querySelector("html")!.setAttribute("data-theme", "business");
  }
});
</script>

<template>
  <div class="w-full flex flex-col h-full overflow-hidden items-center max-w-[800px] bg-base-100 pb-4">
    <Header v-if="appStore.isLoggedIn" />

    <div class="px-4 w-full max-w-3xl min-w-[390px] flex flex-col h-full overflow-hidden">
      <RouterView />
    </div>
    <PWAUpdateAlert />
  </div>
</template>
