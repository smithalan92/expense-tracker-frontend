<script setup lang="ts">
import type { Trip } from "@/api/trip";
import { useRouter } from "vue-router";
const { trip } = defineProps<{
  trip: Trip;
}>();

const router = useRouter();

const onClick = () => {
  router.push({ name: "tripData", params: { tripId: trip.id } });
};
</script>

<template>
  <div
    class="et-card flex w-full h-52 mb-4 cursor-pointer"
    @click="onClick"
  >
    <div
      class="sm:w-48 w-32 bg-cover h-52 shrink-0 rounded-l-2xl"
      :style="{
        backgroundImage: `url(${trip.image})`,
      }"
    ></div>
    <div class="flex-1 px-4 py-4 flex flex-col justify-center">
      <h2 class="text-lg font-semibold text-slate-100">{{ trip.name }}</h2>
      <p class="text-slate-400 text-sm mt-1">{{ trip.startDate }} to {{ trip.endDate }}</p>
      <p class="text-slate-300 mt-2"><span class="font-bold">Expenses: </span> {{ trip.totalExpenseAmount }}</p>
    </div>
  </div>
</template>
