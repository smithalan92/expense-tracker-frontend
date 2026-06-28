<script setup lang="ts">
import { useRegisterSW } from "virtual:pwa-register/vue";

const { needRefresh, updateServiceWorker } = useRegisterSW({
  onRegisteredSW(swUrl, r) {
    console.log(`Service Worker at: ${swUrl}`);
    if (r) {
      setInterval(
        () => {
          r.update();
        },
        1000 * 60 * 30,
      );
    }
  },
  onRegisterError(error) {
    console.log("SW registration error", error);
  },
});
</script>
<template>
  <div v-if="needRefresh" class="absolute w-full h-full flex justify-center items-end py-8">
    <div class="et-dropdown shadow-lg flex p-4 items-center z-50">
      <div class="font-bold text-lg pr-4 text-slate-200">An app update is available.</div>
      <button class="et-btn-primary et-btn-sm" @click="updateServiceWorker(true)">Reload</button>
    </div>
  </div>
</template>
