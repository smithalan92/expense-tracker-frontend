<script setup lang="ts">
import type { CityOption } from "./hooks/useCityOptions";

const { city, isSelected } = defineProps<{
  city: CityOption;
  isSelected: boolean;
  usePill?: boolean;
}>();

const emit = defineEmits<{
  (e: "click", id: number): void;
}>();
</script>

<template>
  <div
    class="flex items-center select-none h-12 overflow-hidden px-2 py-4 hover:opacity-70 cursor-pointer"
    :class="{
      'bg-grey-300 border border-solid border-black rounded-lg justify-center text-center': usePill,
      'border-green-600 bg-green-100': isSelected && usePill,
    }"
    @click="emit('click', city.value)"
  >
    <span :class="{ truncate: true, 'text-green-600': isSelected }">
      {{ city.label }}
    </span>
  </div>
</template>
