<script setup lang="ts">
import { ArrowDown } from "@lucide/vue";
import Spinner from "./ui/spinner/Spinner.vue";

/*
  Sits as the first child of a scroll container driven by usePullToRefresh. Opens by growing
  rather than translating so sticky content below it keeps working.
*/
defineProps<{
  pullDistance: number;
  isRefreshing: boolean;
  isDragging: boolean;
  isArmed: boolean;
  thresholdPx: number;
}>();
</script>

<template>
  <div
    class="flex shrink-0 items-center justify-center overflow-hidden"
    :class="!isDragging && 'transition-[height] duration-200'"
    :style="{ height: `${pullDistance}px` }"
    aria-hidden="true"
  >
    <Spinner v-if="isRefreshing" class="size-5" />
    <ArrowDown
      v-else
      class="size-5 transition-transform"
      :class="isArmed && 'rotate-180'"
      :style="{ opacity: Math.min(1, pullDistance / thresholdPx) }"
    />
  </div>
</template>
