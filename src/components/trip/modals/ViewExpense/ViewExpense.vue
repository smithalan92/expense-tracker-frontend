<script setup lang="ts">
import { Drawer } from "@/components/ui/drawer";
import useUIStateStore from "@/store/uiState.ts";
import { storeToRefs } from "pinia";
import useActiveExpenseCleanup from "../../hooks/useActiveExpenseCleanup.ts";
import ViewExpenseContent from "./ViewExpenseContent.vue";

const store = useUIStateStore();
const { isViewingExpense, activeExpense } = storeToRefs(store);
const { maybeCleanupActiveExpense } = useActiveExpenseCleanup();
</script>
<template>
  <Drawer :open="isViewingExpense" @animation-end="maybeCleanupActiveExpense">
    <ViewExpenseContent v-if="activeExpense" :expense="activeExpense" />
  </Drawer>
</template>
