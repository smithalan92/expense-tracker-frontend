<script setup lang="ts">
import type { TripExpense } from "@/api";
import useTripData from "@/stores/tripDataStore";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import AddOrEditExpenseModal from "./AddOrEditExpenseModal.vue";
import Expense from "./Expense.vue";
import ViewExpenseModal from "./ViewExpenseModal.vue";

const { expenses } = storeToRefs(useTripData());

const showViewExpenseModal = ref(false);
const isEditingExpense = ref(false);
const isCopyExpense = ref(false);

const selectedExpense = ref<Nullable<TripExpense>>(null);

const expenseToEdit = computed(() => {
  if (isEditingExpense.value) return selectedExpense.value;
  return null;
});

const expenseToCopy = computed(() => {
  if (isCopyExpense.value) return selectedExpense.value;
  return null;
});

const onClickExpense = (expense: TripExpense) => {
  selectedExpense.value = expense;
  showViewExpenseModal.value = true;
};

const onCloseViewExpenseModal = () => {
  selectedExpense.value = null;
  showViewExpenseModal.value = false;
};

const onEditExpense = () => {
  isEditingExpense.value = true;
};

const onCopyExpense = () => {
  isCopyExpense.value = true;
};

const onCloseAddOrEditExpenseModal = () => {
  isEditingExpense.value = false;
  isCopyExpense.value = false;
};
</script>

<template>
  <div className="relative">
    <div className="overflow-y-scroll overflow-x-auto w-full h-full pr-2 flex flex-col">
      <div v-if="!expenses.length" className="flex flex-1 justify-center items-center py-8">
        <span>No expenses available.</span>
      </div>

      <Expense
        v-for="expense in expenses"
        :key="expense.id"
        :expense="expense"
        @click="onClickExpense(expense)"
      />
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
    v-if="isEditingExpense || isCopyExpense"
    :expenseToEdit="expenseToEdit"
    :expenseToCopy="expenseToCopy"
    @close="onCloseAddOrEditExpenseModal"
  />
</template>
