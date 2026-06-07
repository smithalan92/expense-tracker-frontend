<script setup lang="ts">
import useTripData from "@/store/tripDataStore";
import useUIStateStore from "@/store/uiState.ts";
import { formatDateRange, getTripCoverStyle } from "@/utils/ui";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  MessageCircleWarning,
  PencilIcon,
  PlusCircle,
  RefreshCwIcon,
} from "@lucide/vue";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import Button from "../ui/button/Button.vue";
import Flag from "../ui/flag/Flag.vue";
import { Spinner } from "../ui/spinner/index.ts";
import ExpenseList from "./ExpenseList.vue";
import Filters from "./Filters.vue";
import useGetCurrentTripId from "./hooks/useGetCurrentTripId";
import AddOrEditExpense from "./modals/AddOrEditExpense/AddOrEditExpense.vue";
import ViewExpense from "./modals/ViewExpense/ViewExpense.vue";

const currentTripId = useGetCurrentTripId();
const tripDataStore = useTripData();
const { setIsAddingOrEditingExpense } = useUIStateStore();
const router = useRouter();

const { trip, isLoadingTripData, hasFailedToLoadTripData, totalExpenseAmount } = storeToRefs(tripDataStore);
const { loadTripData } = tripDataStore;

onBeforeMount(() => {
  loadTripData(currentTripId.value);
});
</script>
<template>
  <div class="flex flex-col flex-1 min-h-0 relative">
    <template v-if="trip && !isLoadingTripData && !hasFailedToLoadTripData">
      <div class="flex flex-col px-4 py-6" :style="getTripCoverStyle(trip.image)">
        <!--- Back & Edit Icons -->
        <div class="flex justify-between">
          <Button
            class="flex items-center justify-center rounded-full bg-black/70 w-[30px] h-[30px]"
            @click="router.back()"
          >
            <ChevronLeft class="size-[16px] text-white" />
          </Button>
          <div>
            <Button variant="secondary">
              <PencilIcon class="size-[12px]" />
              Edit trip
            </Button>
          </div>
        </div>

        <!-- Trip Name -->
        <div
          class="py-8 text-xl font-display"
          style="color: oklch(0.99 0.01 85); text-shadow: 0 1px 12px oklch(0 0 0 / 0.35)"
        >
          {{ trip.name }}
        </div>

        <!-- Dates/Countries -->
        <div class="flex justify-between text-xs">
          <div class="flex items-center">
            <Calendar class="size-[12px] mr-2" />
            {{ formatDateRange(trip.startDate, trip.endDate) }}
          </div>

          <div class="flex">
            <div
              class="overflow-hidden rounded-full -ml-2.5 first:ml-0 border border-solid border-white"
              v-for="country in trip.countries"
              :key="country.code"
            >
              <Flag :code="country.code" class="size-[30px] rounded-[50%]" />
            </div>
          </div>
        </div>
      </div>

      <!-- Spending Amount/Filters etc.. -->
      <div class="flex flex-col px-4 py-2">
        <div>
          <span class="font-mono text-sm text-text-3 uppercase">Total Spent</span>
        </div>
        <div class="flex items-center">
          <div class="pr-4 font-mono text-xl">
            {{ totalExpenseAmount }}
          </div>
          <div class="flex-1 flex justify-end">
            <Filters />
          </div>
        </div>
      </div>

      <div class="flex flex-col flex-1 overflow-hidden px-4">
        <ExpenseList class="pb-20" />
      </div>

      <Button
        variant="default"
        class="absolute bottom-[22px] right-[18px] z-20 items-center justify-center rounded-full font-display text-white"
        @click="setIsAddingOrEditingExpense(true)"
      >
        <PlusCircle class="size-4" />
        Add Expense
      </Button>
    </template>

    <Spinner v-if="isLoadingTripData" :use-overlay="true" />

    <div v-if="hasFailedToLoadTripData" class="px-4 flex flex-col justify-center h-full">
      <div class="flex flex-col items-center mt-12">
        <MessageCircleWarning class="size-10" />
        <span class="mt-4">Something went wrong loading this trip.</span>
      </div>
      <div class="flex mt-4 justify-center gap-4">
        <Button class="px-1 hover:opacity-70" @click="router.go(-1)">
          <ArrowLeft />
          Back
        </Button>
        <Button class="ml-2 px-1 hover:opacity-70" @click="loadTripData(currentTripId)">
          <RefreshCwIcon />
          Retry
        </Button>
      </div>
    </div>
    <ViewExpense />
    <AddOrEditExpense />
  </div>
</template>
