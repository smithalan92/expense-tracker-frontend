<script setup lang="ts">
import { cn } from "@/lib/utils";
import { CircleX } from "@lucide/vue";
import { useVModel } from "@vueuse/core";
import { computed, useAttrs, type HTMLAttributes } from "vue";
import Button from "../button/Button.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number | null;
  hasClearButton?: boolean;
  class?: HTMLAttributes["class"];
  type?: "text" | "email" | "password" | "number" | "date" | "time" | "datetime-local";
  placeholder?: string;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
  (e: "blur"): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});

const attrs = useAttrs();

const isDateTimeType = computed(
  () => props.type === "date" || props.type === "time" || props.type === "datetime-local",
);

// Harmless everywhere, only affects date/time inputs: strip the inner padding/margin
// iOS adds to the value so it sits flush like a normal input.
const dateTimeResetClass =
  "[&::-webkit-date-and-time-value]:m-0 [&::-webkit-date-and-time-value]:text-left [&::-webkit-datetime-edit]:p-0 [&::-webkit-datetime-edit-fields-wrapper]:p-0";

// iOS Safari ONLY (other browsers render date inputs fine): it wraps the value onto
// two lines when narrow and top-aligns the fields. Force a single, vertically-centred
// line that respects h-9. Guarded so it never clips the value on desktop/Android.
const dateTimeIosClass =
  "supports-[-webkit-touch-callout:none]:block supports-[-webkit-touch-callout:none]:overflow-hidden supports-[-webkit-touch-callout:none]:whitespace-nowrap supports-[-webkit-touch-callout:none]:[&::-webkit-datetime-edit]:flex supports-[-webkit-touch-callout:none]:[&::-webkit-datetime-edit]:items-center supports-[-webkit-touch-callout:none]:[&::-webkit-datetime-edit]:whitespace-nowrap supports-[-webkit-touch-callout:none]:[&::-webkit-datetime-edit-fields-wrapper]:flex";
</script>

<template>
  <div class="relative">
    <input
      v-model="modelValue"
      data-slot="input"
      @blur="emits('blur')"
      :type="type"
      :class="
        cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 appearance-none rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [-webkit-appearance:none]',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          isDateTimeType ? cn(dateTimeResetClass, dateTimeIosClass) : '',
          hasClearButton ? 'pr-10' : '',
          attrs.class,
        )
      "
      :placeholder="placeholder"
    />
    <Button v-if="hasClearButton" class="absolute top-2 right-2" @click="modelValue = ''">
      <CircleX class="size-6" />
    </Button>
  </div>
</template>
