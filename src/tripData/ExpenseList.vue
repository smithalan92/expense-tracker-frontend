<script setup lang="ts">
import type { TripExpense } from "@/api/expense";
import useTripData from "@/stores/tripDataStore";
import useUserPreferencesStore from "@/stores/userPreferencesStore";
import { format, isSameYear } from "date-fns";
import { computed, ref, toRefs } from "vue";
import AddOrEditExpenseModal from "./AddOrEditExpenseModal.vue";
import Expense from "./Expense.vue";
import ExpenseAlt from "./ExpenseAlt.vue";
import ViewExpenseModal from "./ViewExpenseModal.vue";

const store = useTripData();
const { expenses, unsavedExpenses, totalExpenseAmount } = toRefs(store);
const { useAlternativeUI } = toRefs(useUserPreferencesStore());

const showViewExpenseModal = ref(false);
const isEditingExpense = ref(false);
const isCopyingExpense = ref(false);

const selectedExpense = ref<Nullable<TripExpense>>(null);

const expensesGroupedByDate = computed(() => {
  return [...expenses.value, ...unsavedExpenses.value].reduce<Record<string, TripExpense[]>>(
    (acc, current) => {
      const date = format(new Date(current.localDateTime), "yyyy-MM-dd");

      if (!acc[date]) acc[date] = [];

      acc[date].push(current);

      return acc;
    },
    {},
  );
});

const expensesToDisplay = computed(() => {
  const exp: TripExpense[] = [...unsavedExpenses.value, ...expenses.value];

  exp.sort((a, b) => {
    return new Date(b.localDateTime).getTime() - new Date(a.localDateTime).getTime();
  });

  return exp;
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
      formattedDate = format(dateRef, "dd MMMM");
    } else {
      formattedDate = format(dateRef, "dd MMMM yyyy");
    }

    const totalExpensesForDate = expenses.reduce((acc, current) => {
      const amount = parseFloat(current.euroAmount);
      console.log({ euroAmount: current.euroAmount, amount });

      return acc + amount;
    }, 0);
    console.log({ totalExpensesForDate });

    allExpensesByDate.push({
      date: formattedDate,
      expenses,
      totalExpensesForDate,
    });
  }

  return allExpensesByDate;
});

const expenseToEdit = computed(() => {
  if (isEditingExpense.value) return selectedExpense.value;
  return null;
});

const expenseToCopy = computed(() => {
  if (isCopyingExpense.value) return selectedExpense.value;
  return null;
});

const onClickExpense = (expense: TripExpense) => {
  selectedExpense.value = expense;
  showViewExpenseModal.value = true;
};

const onCloseViewExpenseModal = () => {
  if (!isEditingExpense.value && !isCopyingExpense.value) selectedExpense.value = null;
  showViewExpenseModal.value = false;
};

const onEditExpense = () => {
  isEditingExpense.value = true;
};

const onCopyExpense = () => {
  isCopyingExpense.value = true;
};

const onCloseAddOrEditExpenseModal = () => {
  isEditingExpense.value = false;
  isCopyingExpense.value = false;
};
</script>

<template>
  <div class="relative">
    <div class="overflow-y-scroll overflow-x-auto w-full h-full pr-2 flex flex-col">
      <div v-if="!expenses.length" class="flex flex-1 justify-center items-center py-8">
        <span>No expenses available.</span>
      </div>

      <template v-if="useAlternativeUI">
        <div v-for="value in expensesToDisplayByDate">
          <div
            class="flex-1 flex justify-between bg-primary text-primary-content py-2 my-2 px-2 font-semibold rounded text-sm"
          >
            <div>{{ value.date }}</div>
            <div>€{{ value.totalExpensesForDate.toFixed(2) }}</div>
          </div>
          <ExpenseAlt
            v-for="expense in value.expenses"
            :key="expense.id"
            :expense="expense"
            @click="onClickExpense(expense)"
          />
        </div>
      </template>

      <Expense
        v-for="expense in expensesToDisplay"
        v-if="!useAlternativeUI"
        :key="expense.id"
        :expense="expense"
        @click="onClickExpense(expense)"
      />
    </div>
    <div v-if="expenses.length" class="sticky -bottom-px select-none bg-base-200 mr-2">
      <div class="text-right w-full py-2 pr-4 font-semibold">Total: {{ totalExpenseAmount }}</div>
    </div>
  </div>
  <ViewExpenseModal
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
  />
</template>

<script lang="ts">
interface ExpensesByDate {
  date: string;
  expenses: TripExpense[];
  totalExpensesForDate: number;
}
</script>
