<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { RefreshCw } from "@lucide/vue";
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
  <!-- pointer-events-none so the full-width wrapper doesn't swallow taps on the
       app behind it; the card itself opts back in. -->
  <div
    v-if="needRefresh"
    class="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pointer-events-none pb-[max(1.25rem,env(safe-area-inset-bottom))]"
  >
    <div
      class="pointer-events-auto flex w-full max-w-[420px] flex-row items-center gap-3.5 rounded-md border border-hairline bg-surface p-4 text-foreground shadow-card animate-in fade-in slide-in-from-bottom-4 duration-300 ease-app"
    >
      <div class="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
        <RefreshCw class="size-4" />
      </div>
      <div class="flex-1">
        <div class="mb-[3px] font-mono text-xs uppercase tracking-[1.4px] text-text-3">Update available</div>
        <div class="text-sm text-text-2">A new version of ExpensIt is ready.</div>
      </div>
      <Button size="sm" class="shrink-0 font-medium" @click="updateServiceWorker()">Reload</Button>
    </div>
  </div>
</template>
