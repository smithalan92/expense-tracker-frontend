<script setup lang="ts">
import Spinner from "@/app/Spinner.vue";
import useTripData from "@/stores/tripDataStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import ExpenseList from "./ExpenseList.vue";
import useGetCurrentTripId from "./hooks/useGetCurrentTripId";

const router = useRouter();
const store = useTripData();
const { trip, isLoading, hasFailedToLoad } = storeToRefs(store);
const { loadTrip } = store;
const currentTripID = useGetCurrentTripId();

onMounted(() => {
  loadTrip(currentTripID.value);
});
</script>

<template>
  <div class="w-full h-full">
    <Spinner v-if="isLoading" :use-overlay="true" />

    <div v-if="hasFailedToLoad" class="text-center">
      Something went wrong loading expenses. Please refresh the page and try again.
    </div>

    <div v-if="!isLoading && !hasFailedToLoad" class="h-full overflow-hidden pt-4 flex flex-col">
      <div class="text-center font-bold text-2xl mb-2">{{ trip.name }}</div>
      <div class="text-center text-md mb-4">{{ trip.startDate }} to {{ trip.endDate }}</div>
      <div class="flex space-between mb-4">
        <div class="flex flex-1">
          <button name="back" class="px-1 hover:opacity-70" @click="router.go(-1)">
            <fa-icon :icon="['fas', 'arrow-left']" size="lg" class="text-primary" />
          </button>
          <button
            name="refresh"
            class="ml-2 px-1 text-primary hover:opacity-70"
            @click="loadTrip(currentTripID)"
          >
            <fa-icon :icon="['fas', 'rotate-right']" size="lg" class="text-primary" />
          </button>
        </div>
        <div class="flex">
          <button name="edit-trip" class="ml-2 px-1 text-primary hover:opacity-70" @click="{}">
            <fa-icon :icon="['fas', 'pen-to-square']" size="lg" />
          </button>
          <button name="delete-trip" class="ml-2 px-1 text-red-500 hover:opacity-70" @click="{}">
            <fa-icon :icon="['fas', 'trash-can']" size="lg" />
          </button>
        </div>
      </div>
      <div class="overflow-x-auto flex-1">
        <ExpenseList />
      </div>
      <div class="flex justify-center py-6">
        <button class="btn btn-primary font-bold text-md text-white" @click="{}">
          <fa-icon :icon="['fas', 'plus']" class="w-6 mr-1" size="xl" /> Expense
        </button>
      </div>
    </div>
  </div>
</template>
