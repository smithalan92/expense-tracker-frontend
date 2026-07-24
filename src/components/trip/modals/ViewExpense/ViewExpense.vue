<script setup lang="ts">
import { Drawer, useDrawerClose } from "@/components/ui/drawer";
import useUIStateStore from "@/store/uiState.ts";
import { storeToRefs } from "pinia";
import ViewExpenseContent from "./ViewExpenseContent.vue";

const store = useUIStateStore();
const { expenseToView } = storeToRefs(store);

const { isOpen, content: expense, key, onOpenComplete } = useDrawerClose(expenseToView);
</script>
<template>
  <Drawer :open="isOpen" @update:open-complete="onOpenComplete">
    <ViewExpenseContent v-if="expense" :key="key" :expense="expense" />
  </Drawer>
</template>
