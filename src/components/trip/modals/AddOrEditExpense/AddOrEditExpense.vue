<script setup lang="ts">
import { Drawer } from "@/components/ui/drawer";
import useUIStateStore from "@/store/uiState.ts";
import { storeToRefs } from "pinia";
import useDrawerClose from "../../../ui/drawer/hooks/useDrawerClose.ts";
import AddOrEditExpenseContent from "./AddOrEditExpenseContent.vue";

const store = useUIStateStore();
const { isAddingOrEditingExpense, activeExpense } = storeToRefs(store);
const { onAnimationEnd, isContentOpen } = useDrawerClose(isAddingOrEditingExpense);
</script>
<template>
  <Drawer :open="isAddingOrEditingExpense" @animation-end="onAnimationEnd">
    <AddOrEditExpenseContent v-if="isContentOpen" :expense="activeExpense" />
  </Drawer>
</template>
