<script setup lang="ts">
import useTripData from "@/store/tripDataStore";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import useGetCurrentTripId from "./hooks/useGetCurrentTripId";
import TripViewContent from "./TripViewContent.vue";
import TripViewLoadingState from "./TripViewLoadingState.vue";

const currentTripId = useGetCurrentTripId();
const tripDataStore = useTripData();

const { trip, isLoadingTripData, hasFailedToLoadTripData } = storeToRefs(tripDataStore);
const { loadTripData } = tripDataStore;

onBeforeMount(() => {
  loadTripData(currentTripId.value);
});
</script>
<template>
  <div class="flex flex-col flex-1 min-h-0 relative">
    <TripViewContent v-if="trip && !isLoadingTripData && !hasFailedToLoadTripData" />

    <TripViewLoadingState
      v-if="isLoadingTripData || hasFailedToLoadTripData"
      :is-loading-trip-data="isLoadingTripData"
      :has-failed-to-load-trip-data="hasFailedToLoadTripData"
    />
  </div>
</template>
