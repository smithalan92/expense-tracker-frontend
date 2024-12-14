<script setup lang="ts">
import type { TripExpense } from "@/api";
import useTripData from "@/stores/tripDataStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import AddOrEditExpenseModal from "./AddOrEditExpenseModal.vue";
import Expense from "./Expense.vue";

const { expenses } = storeToRefs(useTripData());

const showEditExpenseModal = ref(false);

const expenseToEdit = ref<Nullable<TripExpense>>(null);

const onClickExpense = (expense: TripExpense) => {
  expenseToEdit.value = expense;
  showEditExpenseModal.value = true;
};

const onCloseEditExpenseModal = () => {
  expenseToEdit.value = null;
  showEditExpenseModal.value = false;
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
  <AddOrEditExpenseModal
    v-if="showEditExpenseModal"
    :expenseToEdit="expenseToEdit"
    @close="onCloseEditExpenseModal"
  />
</template>
