<script setup lang="ts" generic="T">
import isMobileDevice from "@/utils/isMobile";
import Multiselect from "vue-multiselect";

const { options, placeholder, isMulti, disabled, ...props } = defineProps<{
  options: PickerOption[];
  placeholder?: string;
  class?: string;
  isMulti?: boolean;
  disabled?: boolean;
}>();

const value = defineModel<Nullable<PickerOption | PickerOption[]>>({ required: true });
</script>

<template>
  <multiselect
    class="h-[43px]"
    :class="props.class"
    v-if="!isMobileDevice || isMulti"
    v-model="value"
    :options="options"
    track-by="value"
    label="label"
    :multiple="isMulti"
    :placeholder="placeholder ?? 'Select...'"
    :disabled="disabled"
    :showLabels="false"
  >
    <template #singleLabel="props">
      <div class="truncate text-ellipsis overflow-hidden">{{ props.option.label }}</div>
    </template>

    <template #option="props">
      <div class="truncate text-ellipsis overflow-hidden">{{ props.option.label }}</div>
    </template>
  </multiselect>

  <select
    v-if="isMobileDevice && !isMulti"
    required
    class="select select-bordered rounded-lg bg-white w-full outline-none focus:outline-none"
    :class="props.class"
    :disabled="disabled"
    v-model="value"
  >
    <option value="null" disabled hidden selected>{{ placeholder ?? "Select..." }}</option>
    <option v-for="option in options" :value="option" :key="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<style lang="css">
.vue-select .search-input {
  padding: 8px !important;
}

.multiselect--disabled .multiselect__current,
.multiselect--disabled .multiselect__select {
  background: #fdfcfb !important;
}

.multiselect__placeholder {
  white-space: nowrap !important;
}
</style>

<script lang="ts">
export interface PickerOption {
  label: string;
  value: number;
}
</script>
