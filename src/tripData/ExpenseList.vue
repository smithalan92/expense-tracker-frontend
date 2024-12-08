<script setup lang="ts">
import useTripData from "@/stores/tripDataStore";
import { storeToRefs } from "pinia";
import Expense from "./Expense.vue";

const { expenses } = storeToRefs(useTripData());
</script>

<template>
  <div className="relative">
    <div className="overflow-y-scroll overflow-x-auto w-full h-full pr-2 flex flex-col">
      <div v-if="!expenses.length" className="flex flex-1 justify-center items-center py-8">
        <span>No expenses available.</span>
      </div>

      <Expense v-for="expense in expenses" :key="expense.id" :expense="expense" @click="{}" />
    </div>
  </div>
</template>
