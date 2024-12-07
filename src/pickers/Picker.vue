<script setup lang="ts" generic="T">
import isMobileDevice from "@/utils/isMobile";
import VueSelect from "vue3-select-component";

export interface PickerOption {
  label: string;
  value: any;
}

const { options, placeholder, ...props } = defineProps<{
  options: PickerOption[];
  placeholder?: string;
  class?: string;
  isLoading?: boolean;
  isMulti?: boolean;
}>();

const value = defineModel<T>();
</script>

<template>
  <VueSelect
    v-if="!isMobileDevice"
    class="p-1"
    :class="props.class"
    :options="options"
    :placeholder="placeholder"
    v-model="value"
    :is-clearable="false"
    :is-loading="false"
    :shouldAutofocusOption="true"
    :is-multi="isMulti"
  />

  <select v-if="isMobileDevice" :class="props.class" v-model="value">
    <option hidden>{{ placeholder ?? "Select..." }}</option>
    <option v-for="option in options" :value="option.value" :key="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<style lang="css">
.vue-select .search-input {
  padding: 8px !important;
}
</style>
