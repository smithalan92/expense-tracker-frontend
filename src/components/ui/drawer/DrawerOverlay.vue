<script lang="ts" setup>
import { cn } from "@/utils/ui";
import { reactiveOmit } from "@vueuse/core";
import type { DrawerOverlayProps } from "reka-ui";
import { DrawerOverlay } from "reka-ui";
import type { HTMLAttributes } from "vue";

const props = defineProps<DrawerOverlayProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <DrawerOverlay
    data-slot="drawer-overlay"
    v-bind="delegatedProps"
    :class="
      cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80',
        props.class,
      )
    "
  />
</template>
