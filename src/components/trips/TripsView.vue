<script setup lang="ts">
import { Card } from "@/components/ui/card";
import useTripsStore from "@/store/tripsStore";
import { isAfter } from "date-fns/isAfter";
import { isBefore } from "date-fns/isBefore";
import { parse } from "date-fns/parse";
import { computed, onMounted } from "vue";
import Trip from "./Trip.vue";

const tripsStore = useTripsStore();

const DATE_FMT = "dd MMM yyyy";
const parseDate = (s: string) => parse(s, DATE_FMT, new Date());

const activeTrips = computed(() => {
  const today = new Date();
  return tripsStore.getTrips.filter((trip) => {
    const start = parseDate(trip.startDate);
    const end = parseDate(trip.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return today >= start && today <= end;
  });
});

const upcomingTrips = computed(() => {
  const today = new Date();
  return tripsStore.getTrips.filter((trip) => isAfter(parseDate(trip.startDate), today));
});

const totalSpending = computed(() => {
  const currentYear = new Date().getFullYear();

  const trips = tripsStore.getTrips;

  const tripsInCurrentYear = trips.filter((t) => {
    return new Date(t.startDate).getFullYear() === currentYear;
  });

  return {
    currentYear: tripsInCurrentYear.reduce((acc, current) => (acc += current.totalExpenseAmount), 0),
    allYears: trips.reduce((acc, current) => (acc += current.totalExpenseAmount), 0),
  };
});

const pastTrips = computed(() => {
  const today = new Date();
  return tripsStore.getTrips.filter((trip) => isBefore(parseDate(trip.endDate), today));
});

onMounted(() => {
  tripsStore.loadTrips();
});
</script>
<template>
  <div class="relative flex flex-col flex-1">
    <!-- Header -->
    <div class="flex justify-between items-start px-5 pt-3.5 pb-1">
      <div class="font-mono text-3xl tracking-[1.4px] text-text-3">Your trips</div>
    </div>

    <!-- Summary strip -->
    <div class="px-5 pt-3.5 pb-4x">
      <Card class="flex flex-row p-4 gap-3.5 rounded-md border border-hairline bg-surface text-foreground">
        <div class="flex-1">
          <div class="font-mono text-xs tracking-[1.4px] uppercase text-text-3 mb-[5px]">
            Spent in {{ new Date().getFullYear() }}
          </div>
          <div class="font-mono text-2xl font-semibold tracking-[-0.6px] text-foreground">
            €{{ Intl.NumberFormat().format(totalSpending.currentYear) }}
          </div>
        </div>
        <div class="w-px self-stretch bg-hairline shrink-0" />
        <div class="flex-1">
          <div class="font-mono text-xs tracking-[1.4px] uppercase text-text-3 mb-[5px]">All time</div>
          <div class="font-mono text-2xl font-semibold tracking-[-0.6px] text-text-2">
            €{{ Intl.NumberFormat().format(totalSpending.allYears) }}
          </div>
        </div>
      </Card>
    </div>

    <div class="overflow-y-scroll flex-1 min-h-0 px-5 pt-3.5 pb-24">
      <!-- Active Trips -->
      <section v-if="activeTrips.length > 0" class="pb-6">
        <div class="flex justify-between items-baseline mb-3">
          <h2 class="font-display text-xl m-0">Happening now</h2>
          <span class="text-mono text-md">{{ activeTrips.length }}</span>
        </div>
        <div class="flex flex-col gap-3.5">
          <Trip v-for="trip in activeTrips" :key="trip.id" :trip="trip" />
        </div>
      </section>

      <!-- Upcoming Trips -->
      <section v-if="upcomingTrips.length > 0" class="pb-6">
        <div class="flex justify-between items-baseline mb-3">
          <h2 class="font-display text-xl m-0">Up next</h2>
          <span class="text-mono text-md">{{ upcomingTrips.length }}</span>
        </div>
        <div class="flex flex-col gap-3.5">
          <Trip v-for="trip in upcomingTrips" :key="trip.id" :trip="trip" />
        </div>
      </section>

      <!-- Past Trips -->
      <section v-if="pastTrips.length > 0">
        <div class="flex justify-between items-baseline mb-3">
          <h2 class="font-display text-xl m-0">Past trips</h2>
          <span class="text-mono text-md">{{ pastTrips.length }}</span>
        </div>
        <div class="flex flex-col gap-3.5">
          <Trip v-for="trip in pastTrips" :key="trip.id" :trip="trip" />
        </div>
      </section>
    </div>

    <Button
      class="absolute bottom-[22px] right-[18px] z-20 h-14 rounded-full px-[22px] pl-[18px] gap-2.5 text-[16px] font-bold tracking-[-0.2px] bg-[var(--accent)] text-[var(--on-accent)] hover:bg-[var(--accent-press)] active:scale-95 shadow-[0_10px_26px_-8px_oklch(0.5_0.12_42_/_0.7),0_2px_6px_oklch(0_0_0_/_0.3)]"
      @click="() => {}"
    >
      <Plus :size="22" :stroke-width="2.4" />
      New trip
    </Button>
  </div>
</template>
