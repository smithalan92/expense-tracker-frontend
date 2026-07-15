<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import useAppStore from "@/store/appStore";
import { AlertCircle } from "@lucide/vue";
import { useOnline } from "@vueuse/core";
import { watch } from "vue";
import { RouterView, useRouter } from "vue-router";
import "vue-sonner/style.css";
import "/node_modules/flag-icons/css/flag-icons.min.css";

// import PWAUpdateAlert from "./PWAUpdateAlert.vue";

const appStore = useAppStore();
const router = useRouter();
const isOnline = useOnline();

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
    <div
      v-if="!isOnline"
      class="absolute top-0 left-0 bg-orange-400 z-[9999] w-full h-8 flex justify-center items-center"
    >
      <AlertCircle class="size-4 mr-2" />
      <span class="text-white text-sm font-bold">Your offline</span>
    </div>
    <div class="w-full max-w-3xl min-w-[390px] flex flex-col h-full overflow-hidden">
      <RouterView />
    </div>
    <Toaster
      position="top-center"
      richColors
      :close-button="true"
      close-button-position="top-right"
      :toast-options="{ class: 'pointer-events-auto' }"
    />

    <!-- <PWAUpdateAlert /> -->
  </div>
</template>
