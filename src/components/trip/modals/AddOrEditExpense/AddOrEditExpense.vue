<script setup lang="ts">
import { Drawer, useDrawerClose } from "@/components/ui/drawer";
import useUIStateStore from "@/store/uiState.ts";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import AddOrEditExpenseContent from "./AddOrEditExpenseContent.vue";

const store = useUIStateStore();
const { isAddingExpense, expenseToEdit, expenseToCopy } = storeToRefs(store);

const source = computed(() => {
  if (!isAddingExpense.value && !expenseToEdit.value && !expenseToCopy.value) return null;

  return {
    expense: expenseToEdit.value ?? expenseToCopy.value ?? null,
    isCopying: !!expenseToCopy.value,
  };
});

const { isOpen, content, key, onOpenComplete } = useDrawerClose(source);
</script>
<template>
  <Drawer :open="isOpen" @update:open-complete="onOpenComplete">
    <AddOrEditExpenseContent
      v-if="content"
      :key="key"
      :expense="content.expense"
      :is-copying="content.isCopying"
    />
  </Drawer>
</template>
