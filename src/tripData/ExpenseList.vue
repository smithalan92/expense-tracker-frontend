<script setup lang="ts">
import useTripData from "@/stores/tripDataStore";

const { expenses } = useTripData();
</script>

<template>
  <div className="relative">
    <div className="overflow-y-scroll overflow-x-auto w-full h-full pr-2 flex flex-col">
      <div v-if="!expenses.length" className="flex flex-1 items-center">
        <span>No expenses available.</span>
      </div>

      <div v-for="expense in expenses" :key="expense.id">
        <span>{{ expense.id }} {{ expense.euroAmount }}</span>
      </div>
    </div>
  </div>
</template>
