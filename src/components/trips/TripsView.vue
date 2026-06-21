<script setup lang="ts">
import { type Trip as TripType } from "@/api/trip.ts";
import { Card } from "@/components/ui/card";
import useTripsStore from "@/store/tripsStore";
import useUIStateStore from "@/store/uiState.ts";
import { PlusCircle } from "@lucide/vue";
import { isAfter } from "date-fns/isAfter";
import { isBefore } from "date-fns/isBefore";
import { parse } from "date-fns/parse";
import { computed, onMounted, ref } from "vue";
import Button from "../ui/button/Button.vue";
import Trip from "./Trip.vue";
import AddOrEditTrip from "./modals/AddOrEditTrip/AddOrEditTrip.vue";
import TripInfoModal from "./modals/TripInfoModal/TripInfoModal.vue";

const tripsStore = useTripsStore();
const { setIsAddingOrEditingTrip } = useUIStateStore();

const activeTrip = ref<Nullable<TripType>>(null);
const isViewingTrip = ref(false);

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
  return tripsStore.getTrips
    .filter((trip) => isAfter(parseDate(trip.startDate), today))
    .sort((a, b) => {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
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
  return tripsStore.getTrips
    .filter((trip) => isBefore(parseDate(trip.endDate), today))
    .sort((a, b) => {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
});

const onLongPressTrip = (trip: TripType) => {
  activeTrip.value = trip;
  isViewingTrip.value = true;
};

const onCloseTripInfoModal = () => {
  isViewingTrip.value = false;
  setTimeout(() => (activeTrip.value = null), 1000);
};

onMounted(() => {
  tripsStore.loadTrips();
});
</script>
<template>
  <div class="relative flex flex-col flex-1 min-h-0">
    <!-- Header -->
    <div class="flex justify-between items-start px-5 pt-3.5 pb-1">
      <div class="font-mono text-3xl tracking-[1.4px] text-text-3">Your trips</div>
    </div>

    <!-- Summary strip -->
    <div class="px-5 pt-3.5 pb-4">
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

    <div class="overflow-y-scroll flex-1 min-h-0 px-5 pt-2 pb-20">
      <!-- Active Trips -->
      <section v-if="activeTrips.length > 0" class="pb-6">
        <div class="flex justify-between items-baseline mb-3">
          <h2 class="font-display text-xl m-0">Happening now</h2>
          <span class="text-mono text-md">{{ activeTrips.length }}</span>
        </div>
        <div class="flex flex-col gap-3.5">
          <Trip v-for="trip in activeTrips" :key="trip.id" :trip="trip" @long-press="onLongPressTrip(trip)" />
        </div>
      </section>

      <!-- Upcoming Trips -->
      <section v-if="upcomingTrips.length > 0" class="pb-6">
        <div class="flex justify-between items-baseline mb-3">
          <h2 class="font-display text-xl m-0">Up next</h2>
          <span class="text-mono text-md">{{ upcomingTrips.length }}</span>
        </div>
        <div class="flex flex-col gap-3.5">
          <Trip
            v-for="trip in upcomingTrips"
            :key="trip.id"
            :trip="trip"
            @long-press="onLongPressTrip(trip)"
          />
        </div>
      </section>

      <!-- Past Trips -->
      <section v-if="pastTrips.length > 0">
        <div class="flex justify-between items-baseline mb-3">
          <h2 class="font-display text-xl m-0">Past trips</h2>
          <span class="text-mono text-md">{{ pastTrips.length }}</span>
        </div>
        <div class="flex flex-col gap-3.5">
          <Trip v-for="trip in pastTrips" :key="trip.id" :trip="trip" @long-press="onLongPressTrip(trip)" />
        </div>
      </section>
    </div>

    <Button
      variant="default"
      class="absolute bottom-[22px] right-[18px] z-20 items-center justify-center rounded-full font-display text-white"
      @click="setIsAddingOrEditingTrip(true)"
    >
      <PlusCircle class="size-4" />
      Add Trip
    </Button>
    <TripInfoModal :is-open="isViewingTrip" :trip="activeTrip" @close="onCloseTripInfoModal" />
    <AddOrEditTrip />
  </div>
</template>
