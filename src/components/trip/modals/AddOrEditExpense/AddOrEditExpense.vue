<script setup lang="ts">
import { Drawer, useDrawerClose } from "@/components/ui/drawer";
import useAppStore from "@/store/appStore.ts";
import useUIStateStore from "@/store/uiState.ts";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import AddExpenseWizard from "./AddExpenseWizard.vue";
import AddOrEditExpenseContent from "./AddOrEditExpenseContent.vue";

const store = useUIStateStore();
const appStore = useAppStore();
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
    <AddExpenseWizard v-if="content && !content.expense && appStore.shouldUseAddExpenseWizard" :key="`wizard-${key}`" />
    <AddOrEditExpenseContent
      v-else-if="content"
      :key="`form-${key}`"
      :expense="content.expense"
      :is-copying="content.isCopying"
    />
  </Drawer>
</template>
