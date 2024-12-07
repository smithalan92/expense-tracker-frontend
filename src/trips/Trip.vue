<script setup lang="ts">
import type { Trip } from "@/api";
const { trip } = defineProps<{
  trip: Trip;
}>();
</script>

<template>
  <div
    className="card card-side w-full bg-base-100 shadow-md border border-solid border-base-200 h-52 mb-4 cursor-pointer"
    @click="{}"
  >
    <div
      className="sm:w-48 w-32 bg-cover h-52 flex-shrink-0"
      :style="{
        backgroundImage: `url(${trip.image})`,
      }"
    ></div>
    <div className="card-body px-4 py-2">
      <h2 className="card-title">{{ trip.name }}</h2>
      <p>{{ trip.startDate }} to {{ trip.endDate }}</p>
      <p><span className="font-bold">Expenses: </span> € {{ trip.totalExpenseAmount }}</p>
    </div>
  </div>
</template>
