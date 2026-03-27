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
  <!-- Pill variant -->
  <div
    v-if="usePill"
    class="flex items-center select-none h-12 overflow-hidden px-2 py-4 hover:opacity-70 cursor-pointer bg-grey-300 border border-solid border-black rounded-lg justify-center text-center"
    :class="{ 'border-green-600 bg-green-100': isSelected }"
    @click="emit('click', city.value)"
  >
    <span :class="{ truncate: true, 'text-green-600': isSelected }">
      {{ city.label }}
    </span>
  </div>

  <!-- Checkbox row variant -->
  <div
    v-else
    class="flex items-center gap-3 px-1 py-2.5 cursor-pointer select-none hover:opacity-70"
    @click="emit('click', city.value)"
  >
    <div
      class="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
      :class="isSelected ? 'bg-green-500 border-green-500' : 'border-grey-400'"
    >
      <svg v-if="isSelected" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <span class="truncate">{{ city.label }}</span>
  </div>
</template>
