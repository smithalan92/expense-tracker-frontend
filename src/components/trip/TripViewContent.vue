<script setup lang="ts">
import useTripData from "@/store/tripDataStore";
import useUIStateStore from "@/store/uiState.ts";
import { useIsOnline } from "@/utils/network.ts";
import { formatDateRange, getTripCoverStyle } from "@/utils/ui";
import { Calendar, ChevronLeft, CloudSync, PencilIcon, PlusCircle } from "@lucide/vue";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import AddOrEditTrip from "../trips/modals/AddOrEditTrip/AddOrEditTrip.vue";
import Button from "../ui/button/Button.vue";
import Flag from "../ui/flag/Flag.vue";
import Spinner from "../ui/spinner/Spinner.vue";
import ExpenseList from "./ExpenseList.vue";
import Filters from "./Filters.vue";
import AddOrEditExpense from "./modals/AddOrEditExpense/AddOrEditExpense.vue";
import ViewExpense from "./modals/ViewExpense/ViewExpense.vue";

const isOnline = useIsOnline();

const tripDataStore = useTripData();
const { setIsAddingExpense, setTripToEdit } = useUIStateStore();
const router = useRouter();

const { trip, countries, userIds, totalExpenseAmount, hasUnsavedExpenses, getExpenses, areAnyFiltersActive } =
  storeToRefs(tripDataStore);

const { syncUnsavedExpenses } = tripDataStore;

const isSyncingExpenses = ref(false);

const hasNoExpenses = computed(() => {
  return !getExpenses.value.length && !areAnyFiltersActive.value;
});

const onClickEditTrip = () => {
  setTripToEdit({
    trip: trip.value,
    countries: countries.value,
    userIds: userIds.value,
  });
};

const onClickSync = async () => {
  try {
    isSyncingExpenses.value = true;
    await syncUnsavedExpenses();
    toast.success("Expenses have been sync'd");
  } catch (err) {
    console.error(err);
    toast.error("Failed to sync expenses");
  } finally {
    isSyncingExpenses.value = false;
  }
};
</script>
<template>
  <div class="flex flex-col flex-1 min-h-0 relative">
    <div class="flex flex-col pb-6 px-4 pt-10" :style="getTripCoverStyle(trip.image)">
      <!--- Back & Edit Icons -->
      <div class="flex justify-between">
        <Button
          class="flex items-center justify-center rounded-full bg-black/70 w-[30px] h-[30px]"
          @click="router.back()"
        >
          <ChevronLeft class="size-[16px] text-white" />
        </Button>
        <div>
          <Button variant="secondary" @click="onClickEditTrip">
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
            :data-testid="`country-flag-${country.code}`"
            class="overflow-hidden rounded-full -ml-2 first:ml-0 border border-solid border-white"
            v-for="country in countries"
            :key="country.code"
          >
            <Flag :code="country.code" class="size-[30px] rounded-[50%]" />
          </div>
        </div>
      </div>
    </div>

    <!-- Spending Amount/Filters etc.. -->
    <div v-if="!hasNoExpenses" class="flex pt-2 px-4 items-center">
      <div class="flex flex-col">
        <span class="font-mono text-sm text-text-3 uppercase">Total Spent</span>
        <div class="mt-2 font-mono text-xl" data-testid="total-expense-amount">
          {{ totalExpenseAmount }}
        </div>
      </div>
      <div class="flex-1 flex justify-end">
        <Filters />
      </div>
    </div>

    <div class="flex flex-col flex-1 overflow-hidden">
      <ExpenseList class="pb-20" />
    </div>

    <div class="absolute bottom-[22px] right-[18px] z-20 flex items-center justify-center gap-4">
      <Button
        v-if="hasUnsavedExpenses && isOnline"
        variant="secondary"
        class="text-white"
        @click="onClickSync"
        :disabled="isSyncingExpenses"
      >
        <CloudSync v-if="!isSyncingExpenses" class="size-4" />
        <Spinner v-if="isSyncingExpenses" class="size-4" />
        Sync
      </Button>
      <Button
        data-testid="add-expense-button"
        @click="setIsAddingExpense(true)"
        class="text-white h-[50px] w-[50px] font-bold rounded-full"
      >
        <PlusCircle class="size-8" />
      </Button>
    </div>

    <ViewExpense />
    <AddOrEditExpense />
    <AddOrEditTrip />
  </div>
</template>
