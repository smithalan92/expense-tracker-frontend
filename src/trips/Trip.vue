<script setup lang="ts">
import type { Trip } from "@/api";
const { trip } = defineProps<{
  trip: Trip;
}>();
</script>

<template>
  <div
    class="card card-side w-full bg-base-100 shadow-md border border-solid border-base-200 h-52 mb-4 cursor-pointer"
    @click="{}"
  >
    <div
      class="sm:w-48 w-32 bg-cover h-52 flex-shrink-0 rounded-tl-2xl rounded-bl-2xl"
      :style="{
        backgroundImage: `url(${trip.image})`,
      }"
    ></div>
    <div class="card-body px-4 py-2">
      <h2 class="card-title">{{ trip.name }}</h2>
      <p>{{ trip.startDate }} to {{ trip.endDate }}</p>
      <p><span class="font-bold">Expenses: </span> € {{ trip.totalExpenseAmount }}</p>
    </div>
  </div>
</template>
