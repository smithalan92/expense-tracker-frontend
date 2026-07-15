<script setup lang="ts">
import { Drawer } from "@/components/ui/drawer";
import useUIStateStore from "@/store/uiState.ts";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import useDrawerClose from "../../../ui/drawer/hooks/useDrawerClose.ts";
import AddOrEditExpenseContent from "./AddOrEditExpenseContent.vue";

const store = useUIStateStore();
const { isAddingOrEditingExpense, isCopyingExpense, activeExpense } = storeToRefs(store);

const isAddingEditingOrCopyingExpense = computed(() => {
  return isAddingOrEditingExpense.value || isCopyingExpense.value;
});

const { onAnimationEnd, isContentOpen } = useDrawerClose(isAddingEditingOrCopyingExpense);
</script>
<template>
  <Drawer :open="isAddingEditingOrCopyingExpense" @update:openComplete="onAnimationEnd">
    <AddOrEditExpenseContent v-if="isContentOpen" :expense="activeExpense" :is-copying="isCopyingExpense" />
  </Drawer>
</template>
