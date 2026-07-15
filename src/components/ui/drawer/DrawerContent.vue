<script lang="ts" setup>
import { cn } from "@/utils/ui";
import type { DrawerContentEmits, DrawerContentProps } from "reka-ui";
import { useForwardPropsEmits } from "reka-ui";
import { DrawerContent, DrawerPortal } from "reka-ui";
import type { HTMLAttributes } from "vue";
import DrawerOverlay from "./DrawerOverlay.vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<DrawerContentProps & { class?: HTMLAttributes["class"] }>();
const emits = defineEmits<DrawerContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent
      data-slot="drawer-content"
      v-bind="{ ...$attrs, ...forwarded }"
      :class="
        cn(
          'group/drawer-content bg-background fixed z-50 flex h-auto flex-col',
          'data-[swipe-direction=up]:inset-x-0 data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:mb-24 data-[swipe-direction=up]:max-h-[80vh] data-[swipe-direction=up]:rounded-b-lg',
          'data-[swipe-direction=down]:inset-x-0 data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:mt-24 data-[swipe-direction=down]:max-h-[80vh] data-[swipe-direction=down]:rounded-t-lg',
          'data-[swipe-direction=right]:inset-y-0 data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:w-3/4 data-[swipe-direction=right]:sm:max-w-sm',
          'data-[swipe-direction=left]:inset-y-0 data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:w-3/4 data-[swipe-direction=left]:sm:max-w-sm',
          // Slide-in / slide-out per swipe direction
          'data-[swipe-direction=down]:data-[state=open]:animate-in data-[swipe-direction=down]:data-[state=open]:slide-in-from-bottom',
          'data-[swipe-direction=down]:data-[state=closed]:animate-out data-[swipe-direction=down]:data-[state=closed]:slide-out-to-bottom',
          'data-[swipe-direction=up]:data-[state=open]:animate-in data-[swipe-direction=up]:data-[state=open]:slide-in-from-top',
          'data-[swipe-direction=up]:data-[state=closed]:animate-out data-[swipe-direction=up]:data-[state=closed]:slide-out-to-top',
          'data-[swipe-direction=right]:data-[state=open]:animate-in data-[swipe-direction=right]:data-[state=open]:slide-in-from-right',
          'data-[swipe-direction=right]:data-[state=closed]:animate-out data-[swipe-direction=right]:data-[state=closed]:slide-out-to-right',
          'data-[swipe-direction=left]:data-[state=open]:animate-in data-[swipe-direction=left]:data-[state=open]:slide-in-from-left',
          'data-[swipe-direction=left]:data-[state=closed]:animate-out data-[swipe-direction=left]:data-[state=closed]:slide-out-to-left',
          'duration-500',
          props.class,
        )
      "
    >
      <div
        class="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[swipe-direction=down]/drawer-content:block"
      />
      <slot />
    </DrawerContent>
  </DrawerPortal>
</template>
