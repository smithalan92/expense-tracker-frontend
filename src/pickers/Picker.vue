<script setup lang="ts" generic="T">
import useUserPreferencesStore from "@/stores/userPreferencesStore";
import isMobileDevice from "@/utils/isMobile";
import { computed, toRefs } from "vue";
import Multiselect from "vue-multiselect";

const { options, placeholder, isMulti, disabled, name, ...props } = defineProps<{
  options: PickerOption[];
  placeholder?: string;
  class?: string;
  isMulti?: boolean;
  disabled?: boolean;
  name?: string;
}>();

const { useAlternativeUI } = toRefs(useUserPreferencesStore());

const value = defineModel<Nullable<PickerOption | PickerOption[]>>({ required: true });

// Bridge for native <select> when NOT multi-select
const nativeSingleValue = computed({
  get() {
    const current = value.value as PickerOption | null;
    return current?.value ?? ""; // empty string means "placeholder"
  },
  set(val: number | string) {
    // convert to number because PickerOption.value is number
    const numericVal = typeof val === "string" && val !== "" ? Number(val) : (val as number);

    const selected = options.find((o) => o.value === numericVal) ?? null;
    value.value = selected;
  },
});
</script>

<template>
  <div :class="{ [props.class ?? '']: props.class, 'alt-theme': useAlternativeUI }">
    <multiselect
      class="h-[43px] w-full"
      :class="{ [props.class ?? '']: props.class }"
      v-if="!isMobileDevice || isMulti"
      v-model="value"
      :options="options"
      track-by="value"
      label="label"
      :multiple="isMulti"
      :placeholder="placeholder ?? 'Select...'"
      :disabled="disabled"
      :showLabels="false"
      :hide-selected="true"
      :close-on-select="true"
      :searchable="!isMulti"
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
      class="select select-bordered rounded-lg w-full outline-none focus:outline-none"
      :class="{ [props.class ?? '']: props.class, 'bg-grey-900': useAlternativeUI }"
      :disabled="disabled"
      v-model="nativeSingleValue"
    >
      <option value="" disabled hidden>
        {{ placeholder ?? "Select..." }}
      </option>

      <option v-for="option in options" :value="option.value" :key="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<style lang="css">
.multiselect--disabled .multiselect__current,
.multiselect--disabled .multiselect__select {
  background: #fdfcfb !important;
}

.multiselect__placeholder {
  white-space: nowrap !important;
}

.multiselect__tags-wrap {
  display: flex !important;
}

.alt-theme .multiselect__tag {
  background: var(--color-white);
  color: var(--color-base-100);
}

.alt-theme .multiselect__option--highlight {
  background: var(--color-gray-500);
}

.alt-theme .multiselect__option--highlight:after {
  background: var(--color-gray-500);
}

.alt-theme .multiselect__option--selected.multiselect__option--highlight {
  background: var(--color-gray-500);
}

.alt-theme .multiselect__option--selected.multiselect__option--highlight:after {
  background: var(--color-gray-500);
}

.alt-theme .multiselect__tag-icon:hover {
  background: var(--color-black);
}

.alt-theme .multiselect__input,
.alt-theme .multiselect__single {
  padding: 0 0 0 0;
}

.alt-theme .multiselect__placeholder {
  color: var(--color-white);
}

.alt-theme .multiselect__tags {
  background: var(--color-base-100);
}

.alt-theme .multiselect__content-wrapper {
  background: var(--color-base-100);
}
</style>

<script lang="ts">
export interface PickerOption {
  label: string;
  value: number;
}
</script>
