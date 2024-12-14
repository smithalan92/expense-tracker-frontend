<script setup lang="ts">
const { useOverlay } = defineProps<{
  useOverlay?: boolean;
}>();
</script>
<template>
  <div
    v-if="!useOverlay"
    class="radial-progress animate-spin"
    :style="{ '--value': 80, '--size': '48px', color: '#0284c7' }"
  />

  <div
    v-if="useOverlay"
    className="absolute w-screen h-screen bg-base-100/50 z-10 flex items-center justify-center top-0 left-0"
  >
    <div
      class="radial-progress animate-spin"
      :style="{ '--value': 80, '--size': '48px', color: '#0284c7' }"
    />
  </div>
</template>
