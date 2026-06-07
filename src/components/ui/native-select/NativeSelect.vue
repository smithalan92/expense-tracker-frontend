<script setup lang="ts">
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@lucide/vue";
import { reactiveOmit, useVModel } from "@vueuse/core";
import type { AcceptableValue } from "reka-ui";
import type { HTMLAttributes } from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  modelValue?: AcceptableValue | AcceptableValue[];
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits<{
  "update:modelValue": AcceptableValue;
}>();

const modelValue = useVModel(props, "modelValue", emit, {
  passive: true,
  defaultValue: "",
});

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <div
    data-slot="native-select-wrapper"
    :class="
      cn(
        'group/native-select border-input dark:bg-input/30 dark:hover:bg-input/50 relative flex h-9 w-full min-w-0 items-center overflow-hidden rounded-md border bg-transparent shadow-xs transition-[color,box-shadow]',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-3',
        'has-[select[aria-invalid=true]]:ring-destructive/20 dark:has-[select[aria-invalid=true]]:ring-destructive/40 has-[select[aria-invalid=true]]:border-destructive',
        'has-[select:disabled]:pointer-events-none has-[select:disabled]:opacity-50',
        props.class,
      )
    "
  >
    <select
      v-bind="{ ...$attrs, ...delegatedProps }"
      v-model="modelValue"
      data-slot="native-select"
      class="placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground h-full w-full min-w-0 appearance-none border-0 bg-transparent px-3 pr-9 text-sm outline-none disabled:cursor-not-allowed [-webkit-appearance:none] truncate"
    >
      <slot />
    </select>
    <ChevronDownIcon
      class="text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 opacity-50 select-none"
      aria-hidden="true"
      data-slot="native-select-icon"
    />
  </div>
</template>
