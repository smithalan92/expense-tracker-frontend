<script setup lang="ts" generic="T">
import isMobileDevice from "@/utils/isMobile";
import Multiselect from "vue-multiselect";

export interface PickerOption {
  label: string;
  value: any;
}

const { options, placeholder, ...props } = defineProps<{
  options: PickerOption[];
  placeholder?: string;
  class?: string;
  isMulti?: boolean;
}>();

const value = defineModel<T>();
</script>

<template>
  <multiselect
    class="p-1"
    :class="props.class"
    v-if="!isMobileDevice || isMulti"
    v-model="value"
    :options="options"
    track-by="value"
    label="label"
    :multiple="isMulti"
    :placeholder="placeholder ?? 'Select...'"
  />

  <select v-if="isMobileDevice && !isMulti" :class="props.class" v-model="value">
    <option hidden>{{ placeholder ?? "Select..." }}</option>
    <option v-for="option in options" :value="option" :key="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<style lang="css">
.vue-select .search-input {
  padding: 8px !important;
}
</style>
