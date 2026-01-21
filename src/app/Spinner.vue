<script setup lang="ts">
const { useOverlay } = defineProps<{
  useOverlay?: boolean;
}>();
</script>
<template>
  <div v-if="!useOverlay" class="et-spinner" />

  <div
    v-if="useOverlay"
    class="fixed w-screen h-screen z-10 flex items-center justify-center top-0 left-0"
    style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px)"
  >
    <div class="et-spinner" />
  </div>
</template>
