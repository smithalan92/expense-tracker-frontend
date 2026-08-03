<script setup lang="ts">
import type { TripExpense } from "@/api/expense";
import useTripData from "@/store/tripDataStore";
import { useIsOnline } from "@/utils/network";
import { ArrowDown, BanknoteX } from "@lucide/vue";
import { format, isSameYear } from "date-fns";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";
import Button from "../ui/button/Button.vue";
import Spinner from "../ui/spinner/Spinner.vue";
import Expense from "./Expense.vue";
import useGetCurrentTripId from "./hooks/useGetCurrentTripId";
import usePullToRefresh from "./hooks/usePullToRefresh";

const props = defineProps<{ class?: string }>();

const store = useTripData();
const { getExpenses, areAnyFiltersActive } = storeToRefs(store);
const { clearFilters, refreshTripData } = store;

const isOnline = useIsOnline();
const currentTripId = useGetCurrentTripId();

const scrollEl = ref<HTMLElement | null>(null);

const { pullDistance, isRefreshing, isDragging, isArmed, thresholdPx } = usePullToRefresh(
  scrollEl,
  async () => {
    if (!isOnline.value) {
      toast.error("Can't refresh while offline");
      return;
    }

    try {
      await refreshTripData(currentTripId.value);
    } catch (err) {
      console.error(err);
      toast.error("Failed to refresh expenses");
    }
  },
);

const expensesGroupedByDate = computed(() => {
  return getExpenses.value.reduce<Record<string, TripExpense[]>>((acc, current) => {
    const date = format(new Date(current.localDateTime), "yyyy-MM-dd");

    if (!acc[date]) acc[date] = [];

    acc[date].push(current);

    return acc;
  }, {});
});

const expensesToDisplayByDate = computed(() => {
  // first we'll create arrays of all the dates and sort them in DESC order
  const dates = Object.keys(expensesGroupedByDate.value).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const allExpensesByDate: ExpensesByDate[] = [];

  for (const date of dates) {
    const expenses = expensesGroupedByDate.value[date]!.sort((a, b) => {
      return new Date(b.localDateTime).getTime() - new Date(a.localDateTime).getTime();
    });

    let formattedDate;
    const dateRef = new Date(date);

    if (isSameYear(new Date(), dateRef)) {
      formattedDate = format(dateRef, "EEE, MMM do");
    } else {
      formattedDate = format(dateRef, "EEE, MMM do yyyy");
    }

    const totalExpensesForDate = expenses.reduce((acc, current) => {
      const amount = parseFloat(current.euroAmount);

      return acc + amount;
    }, 0);

    allExpensesByDate.push({
      date: formattedDate,
      expenses,
      totalExpensesForDate: totalExpensesForDate,
    });
  }

  return allExpensesByDate;
});
</script>

<template>
  <div
    ref="scrollEl"
    class="overflow-y-auto overscroll-contain w-full flex-1 flex flex-col"
    :class="props.class"
  >
    <!-- Pull to refresh indicator. Opens by growing rather than translating so the
         sticky date headers below keep working. -->
    <div
      class="flex shrink-0 items-center justify-center overflow-hidden"
      :class="!isDragging && 'transition-[height] duration-200'"
      :style="{ height: `${pullDistance}px` }"
      aria-hidden="true"
    >
      <Spinner v-if="isRefreshing" class="size-5" />
      <ArrowDown
        v-else
        class="size-5 transition-transform"
        :class="isArmed && 'rotate-180'"
        :style="{ opacity: Math.min(1, pullDistance / thresholdPx) }"
      />
    </div>

    <div
      v-if="!getExpenses.length"
      class="flex flex-col flex-1 justify-center items-center py-12"
      :class="!areAnyFiltersActive ? 'border border-dashed m-24 rounded-lg' : ''"
    >
      <BanknoteX class="mb-4 size-12" />

      <div v-if="areAnyFiltersActive" class="flex flex-col">
        <span v-if="areAnyFiltersActive">No expenses match your filters</span>
        <Button v-if="areAnyFiltersActive" variant="secondary" class="mt-6" @click="clearFilters">
          Clear filters
        </Button>
      </div>

      <span v-else>No expenses just yet</span>
    </div>

    <div v-for="value in expensesToDisplayByDate" :key="value.date">
      <div class="flex-1 pb-4 pt-6 top-0 bg-background z-10 sticky">
        <div class="flex justify-between px-6 flex font-display font-semibold text-sm">
          <div>{{ value.date }}</div>
          <div>
            {{
              Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" }).format(
                value.totalExpensesForDate,
              )
            }}
          </div>
        </div>
      </div>
      <Expense v-for="expense in value.expenses" :key="expense.id" :expense="expense" />
    </div>
  </div>
</template>

<script lang="ts">
interface ExpensesByDate {
  date: string;
  expenses: TripExpense[];
  totalExpensesForDate: number;
}
</script>
