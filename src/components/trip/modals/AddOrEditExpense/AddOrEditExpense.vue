<script setup lang="ts">
import { Drawer } from "@/components/ui/drawer";
import useUIStateStore from "@/store/uiState.ts";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import useDrawerClose from "../../../ui/drawer/hooks/useDrawerClose.ts";
import AddOrEditExpenseContent from "./AddOrEditExpenseContent.vue";

console.log("[DEBUG] AddOrEditExpense setup running");
const store = useUIStateStore();
const { isAddingOrEditingExpense, isCopyingExpense, activeExpense } = storeToRefs(store);

const isAddingEditingOrCopyingExpense = computed(() => {
  return isAddingOrEditingExpense.value || isCopyingExpense.value;
});

const { onAnimationEnd, isContentOpen } = useDrawerClose(isAddingEditingOrCopyingExpense);

// Forces a fresh AddOrEditExpenseContent instance on every open, so stale form
// state can't survive a reopen that happens before the previous close animation finishes.
const openNonce = ref(0);
watch(isAddingEditingOrCopyingExpense, (newValue) => {
  console.log("[DEBUG] isAddingEditingOrCopyingExpense watch fired", newValue, "activeExpense", activeExpense.value);
  if (newValue) openNonce.value++;
  console.log("[DEBUG] openNonce is now", openNonce.value);
});
</script>
<template>
  <Drawer :open="isAddingEditingOrCopyingExpense" @update:openComplete="onAnimationEnd">
    <AddOrEditExpenseContent
      v-if="isContentOpen"
      :key="openNonce"
      :expense="activeExpense"
      :is-copying="isCopyingExpense"
    />
  </Drawer>
</template>
