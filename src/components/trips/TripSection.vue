<script setup lang="ts">
import { type Trip as TripType } from "@/api/trip.ts";
import Trip from "./Trip.vue";

const { title } = defineProps<{
  title: string;
  trips: TripType[];
}>();

const emit = defineEmits<{
  longPress: [trip: TripType];
}>();
</script>

<template>
  <section class="pb-6">
    <div class="flex justify-between items-baseline mb-3">
      <h2 class="font-display text-xl m-0">{{ title }}</h2>
      <span class="font-mono text-text-2 text-sm">{{ trips.length }} trips</span>
    </div>
    <div class="flex flex-col gap-3.5">
      <Trip v-for="trip in trips" :key="trip.id" :trip="trip" @long-press="emit('longPress', trip)" />
    </div>
  </section>
</template>
