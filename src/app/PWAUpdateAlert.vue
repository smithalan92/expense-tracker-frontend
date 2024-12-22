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
  <div
    v-if="needRefresh"
    class="shadow-lg absolute bottom-5 right-[10%] flex bg-accent p-4 rounded-lg items-center"
  >
    <div class="font-bold text-lg pr-4">An update is available.</div>
    <button class="btn btn-sm btn-primary" @click="updateServiceWorker(true)">Reload</button>
  </div>
</template>
