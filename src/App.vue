<script setup lang="ts">
import useAppStore from "@/store/appStore";
import { watch } from "vue";
import { RouterView, useRouter } from "vue-router";
import "/node_modules/flag-icons/css/flag-icons.min.css";

// import PWAUpdateAlert from "./PWAUpdateAlert.vue";

const appStore = useAppStore();
const router = useRouter();

watch(
  () => appStore.isLoggedIn,
  (currentValue, previousValue) => {
    if (previousValue && !currentValue) {
      router.push({ name: "login" });
    }
  },
);
</script>

<template>
  <div class="w-full flex flex-col h-full overflow-hidden items-center max-w-[800px] pb-4">
    <div class="w-full max-w-3xl min-w-[390px] flex flex-col h-full overflow-hidden">
      <RouterView class="flex flex-col flex-1 min-h-0" />
    </div>
    <!-- <PWAUpdateAlert /> -->
  </div>
</template>
