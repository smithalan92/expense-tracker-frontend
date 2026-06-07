<script setup lang="ts">
import type { TripExpense } from "@/api/expense";
import useTripData from "@/store/tripDataStore";
import { format, isSameYear } from "date-fns";
import { computed, toRefs } from "vue";
// import AddOrEditExpenseModal from "./AddOrEditExpenseModal.vue";
import Button from "../ui/button/Button.vue";
import Expense from "./Expense.vue";
// import ViewExpenseModal from "./ViewExpenseModal.vue";

const props = defineProps<{ class?: string }>();

const store = useTripData();
const { getExpenses, areAnyFiltersActive } = toRefs(store);
const { clearFilters } = store;

// const isEditingExpense = ref(false);
// const isCopyingExpense = ref(false);

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
      totalExpensesForDate,
    });
  }

  return allExpensesByDate;
});

// const expenseToEdit = computed(() => {
//   if (isEditingExpense.value) return selectedExpense.value;
//   return null;
// });

// const expenseToCopy = computed(() => {
//   if (isCopyingExpense.value) return selectedExpense.value;
//   return null;
// });

// const onCopyExpenseAction = (expense: TripExpense) => {
//   openExpenseId.value = null;
//   selectedExpense.value = expense;
//   isCopyingExpense.value = true;
// };

// const onDeleteExpenseAction = (expense: TripExpense) => {
//   openExpenseId.value = null;
//   console.log("Delete expense", expense.id);
// };

// const onCloseViewExpenseModal = () => {
//   if (!isEditingExpense.value && !isCopyingExpense.value) selectedExpense.value = null;
//   showViewExpenseModal.value = false;
// };

// const onEditExpense = () => {
//   isEditingExpense.value = true;
// };

// const onCopyExpense = () => {
//   isCopyingExpense.value = true;
// };

// const onCloseAddOrEditExpenseModal = () => {
//   isEditingExpense.value = false;
//   isCopyingExpense.value = false;
// };
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
          <div>€{{ Intl.NumberFormat().format(value.totalExpensesForDate) }}</div>
        </div>
      </div>
      <Expense v-for="expense in value.expenses" :key="expense.id" :expense="expense" />
    </div>
  </div>
  <!-- <ViewExpenseModal
    v-if="showViewExpenseModal && selectedExpense"
    :expense="selectedExpense"
    @edit="onEditExpense"
    @copy="onCopyExpense"
    @close="onCloseViewExpenseModal"
  />
  <AddOrEditExpenseModal
    v-if="isEditingExpense || isCopyingExpense"
    :expenseToEdit="expenseToEdit"
    :expenseToCopy="expenseToCopy"
    @close="onCloseAddOrEditExpenseModal"
  /> -->
</template>

<script lang="ts">
interface ExpensesByDate {
  date: string;
  expenses: TripExpense[];
  totalExpensesForDate: number;
}
</script>
