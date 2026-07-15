<script setup lang="ts">
import { cn } from "@/utils/ui";

const props = withDefaults(
  defineProps<{
    title: string;
    disabled?: boolean;
    position?: "top" | "bottom" | "left" | "right";
    class?: string;
  }>(),
  {
    disabled: false,
    position: "top",
  },
);
</script>

<template>
  <div v-if="!disabled" class="tooltip-root group relative inline-flex w-full">
    <slot />
    <span
      :class="
        cn(
          'tooltip-label pointer-events-none absolute z-50 w-max max-w-36 text-center rounded border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-sm',
          'opacity-0 invisible transition-opacity duration-150',
          position === 'top' && 'bottom-full left-1/2 mb-1.5 -translate-x-1/2',
          position === 'bottom' && 'top-full left-1/2 mt-1.5 -translate-x-1/2',
          position === 'left' && 'right-full top-1/2 mr-1.5 -translate-y-1/2',
          position === 'right' && 'left-full top-1/2 ml-1.5 -translate-y-1/2',
          props.class,
        )
      "
    >
      {{ title }}
      <span
        :class="
          cn(
            'absolute size-2 rotate-45 border bg-popover',
            position === 'top' && 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-t-0 border-l-0',
            position === 'bottom' && 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-b-0 border-r-0',
            position === 'left' && 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 border-b-0 border-l-0',
            position === 'right' && 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-t-0 border-r-0',
          )
        "
      />
    </span>
  </div>
  <slot v-else />
</template>

<style scoped>
.tooltip-root:hover .tooltip-label {
  opacity: 1;
  visibility: visible;
}

/* On touch/mobile devices show the tooltip persistently */
@media (hover: none) {
  .tooltip-label {
    opacity: 1 !important;
    visibility: visible !important;
  }
}
</style>
