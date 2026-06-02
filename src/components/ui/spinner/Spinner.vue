<script setup lang="ts">
import { cn } from "@/lib/utils";
import { Loader2Icon } from "@lucide/vue";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  useOverlay?: boolean;
}>();
</script>

<template>
  <Loader2Icon
    v-if="!useOverlay"
    role="status"
    aria-label="Loading"
    :class="cn('size-4 animate-spin', props.class)"
  />

  <div
    v-if="useOverlay"
    class="fixed w-screen h-screen z-20 flex items-center justify-center top-0 left-0 bg-primary/30"
    style="backdrop-filter: blur(4px)"
  >
    <Loader2Icon role="status" aria-label="Loading" :class="cn('size-12 animate-spin', props.class)" />
  </div>
</template>
