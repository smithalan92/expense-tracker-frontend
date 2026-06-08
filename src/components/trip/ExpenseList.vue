<script setup lang="ts">
import type { TripExpense } from "@/api/expense";
import useTripData from "@/store/tripDataStore";
import { format, isSameYear } from "date-fns";
import { computed, toRefs } from "vue";
import Button from "../ui/button/Button.vue";
import Expense from "./Expense.vue";

const props = defineProps<{ class?: string }>();

const store = useTripData();
const { getExpenses, areAnyFiltersActive } = toRefs(store);
const { clearFilters } = store;

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
  <div class="overflow-y-auto overscroll-contain w-full flex-1 lex flex-col" :class="props.class">
    <div v-if="!getExpenses.length" class="flex flex-col flex-1 justify-center items-center py-8">
      <span v-if="!areAnyFiltersActive">No expenses available.</span>
      <span v-if="areAnyFiltersActive">No expenses match your filters.</span>
      <Button v-if="areAnyFiltersActive" variant="secondary" class="mt-4" @click="clearFilters">
        Clear filters
      </Button>
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
