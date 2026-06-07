<script setup lang="ts">
import { Drawer } from "@/components/ui/drawer";
import useUIStateStore from "@/store/uiState.ts";
import { storeToRefs } from "pinia";
import useDrawerClose from "../../hooks/useDrawerClose.ts";
import ViewExpenseContent from "./ViewExpenseContent.vue";

const store = useUIStateStore();
const { isViewingExpense, activeExpense } = storeToRefs(store);
const { onAnimationEnd, isContentOpen } = useDrawerClose(isViewingExpense);
</script>
<template>
  <Drawer :open="isViewingExpense" @animation-end="onAnimationEnd">
    <ViewExpenseContent v-if="isContentOpen && activeExpense" :expense="activeExpense" />
  </Drawer>
</template>
