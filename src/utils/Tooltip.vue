<script setup lang="ts">
import { computed, toRefs } from "vue";
import Popper from "vue3-popper";
import isMobileDevice from "./isMobile";

const props = defineProps<{
  disabled?: boolean;
  message: string;
  forceOpenOnMobile?: boolean;
  placement?: InstanceType<typeof Popper>["$props"]["placement"];
}>();

const { disabled, message, forceOpenOnMobile } = toRefs(props);

const shouldShow = computed(() => {
  if (forceOpenOnMobile.value && isMobileDevice) return true;
  return undefined;
});
</script>

<template>
  <Popper
    :placement="placement ?? 'auto-start'"
    :hover="!isMobileDevice"
    :disabled="disabled"
    :show="shouldShow"
    :arrow="true"
  >
    <slot />

    <template #content>{{ message }}</template>
  </Popper>
</template>

<style scoped>
:deep(.popper) {
  background: #353234 !important;
  padding: 12px 16px !important;
  border-radius: 20px !important;
  color: #fff !important;
  font-size: 12px;
  max-width: 200px;
}

:deep(.popper #arrow::before) {
  background: #353234 !important;
}

:deep(.popper:hover),
:deep(.popper:hover > #arrow::before) {
  background: #353234 !important;
}
</style>
