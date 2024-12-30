<script setup lang="ts">
import Spinner from "@/app/Spinner.vue";
import useTripsStore from "@/stores/tripsStore";
import { onMounted, ref } from "vue";
import AddOrEditTripModal from "./AddOrEditTripModal.vue";
import Trip from "./Trip.vue";

const isAddTripModalOpen = ref(false);

const openAddTripModal = () => {
  isAddTripModalOpen.value = true;
};

const closeAddTripModal = () => {
  isAddTripModalOpen.value = false;
};

const tripsStore = useTripsStore();

onMounted(() => {
  tripsStore.loadTrips();
});
</script>

<template>
  <div class="pr-4 flex-1 overflow-scroll">
    <div class="w-full flex justify-end px-4 pb-4 sticky top-0 z-[1] bg-base-100">
      <button class="btn btn-sm gap-2 btn-primary text-white" @click="openAddTripModal">
        <fa-icon :icon="['fas', 'plus']" class="w-4 h-4" /> Add Trip
      </button>
    </div>
    <div class="w-full h-full">
      <div v-if="tripsStore.isLoading" class="w-full h-full flex flex-1 justify-center items-center">
        <Spinner />
      </div>

      <div v-if="tripsStore.hasFailedToLoad" class="w-full h-full flex justify-center items-center">
        Something went wrong loading trips. Please refresh the page and try again.
      </div>

      <div
        v-if="!tripsStore.isLoading && !tripsStore.hasFailedToLoad && tripsStore.trips.length === 0"
        class="w-full h-full flex justify-center items-center"
      >
        No trips available
      </div>

      <div v-if="tripsStore.getTrips">
        <Trip v-for="trip in tripsStore.getTrips" :key="trip.id" :trip="trip" />
      </div>
    </div>
  </div>
  <AddOrEditTripModal v-if="isAddTripModalOpen" @close="closeAddTripModal" />
</template>
