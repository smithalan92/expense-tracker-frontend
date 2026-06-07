<script lang="ts" setup>
import { cn } from "@/lib/utils";
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon, XIcon } from "@lucide/vue";
import type { ToasterProps } from "vue-sonner";
import { Toaster as Sonner } from "vue-sonner";

const props = defineProps<ToasterProps>();
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',

      '--success-bg': 'color-mix(in oklab, var(--positive) 16%, var(--popover))',
      '--success-border': 'color-mix(in oklab, var(--positive) 40%, transparent)',
      '--success-text': 'oklch(0.85 0.09 158)',

      '--error-bg': 'color-mix(in oklab, var(--destructive) 16%, var(--popover))',
      '--error-border': 'color-mix(in oklab, var(--destructive) 40%, transparent)',
      '--error-text': 'oklch(0.82 0.18 25)',

      '--warning-bg': 'color-mix(in oklab, var(--ochre) 38%, var(--popover))',
      '--warning-border': 'color-mix(in oklab, var(--ochre) 55%, var(--popover))',
      '--warning-text': 'oklch(0.92 0.11 85)',

      '--info-bg': 'color-mix(in oklab, oklch(0.62 0.13 240) 24%, var(--popover))',
      '--info-border': 'color-mix(in oklab, oklch(0.62 0.13 240) 48%, var(--popover))',
      '--info-text': 'oklch(0.86 0.1 240)',
    }"
    v-bind="props"
  >
    <template #success-icon>
      <CircleCheckIcon class="size-4" />
    </template>
    <template #info-icon>
      <InfoIcon class="size-4" />
    </template>
    <template #warning-icon>
      <TriangleAlertIcon class="size-4" />
    </template>
    <template #error-icon>
      <OctagonXIcon class="size-4" />
    </template>
    <template #loading-icon>
      <div>
        <Loader2Icon class="size-4 animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <XIcon class="size-4" />
    </template>
  </Sonner>
</template>
