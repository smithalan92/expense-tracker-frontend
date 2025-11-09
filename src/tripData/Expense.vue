<script setup lang="ts">
import type { TripExpense } from "@/api/expense";
import { format } from "date-fns";
import { computed } from "vue";
import ExpenseCategoryIcon from "./ExpenseCategoryIcon.vue";

const { expense } = defineProps<{
  expense: TripExpense;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

const date = computed(() => new Date(expense.localDateTime));
const expenseTime = computed(() => format(date.value, "HH:mm"));
const expenseDay = computed(() => format(date.value, "do"));
const expenseMonth = computed(() => format(date.value, "MMM"));
const userNames = computed(() => {
  if (expense.users.length <= 2) {
    return expense.users.map((u) => `${u.firstName} ${u.lastName.slice(0, 1).toUpperCase()}`).join(" & ");
  }

  return `(${expense.users.length})`;
});
const isUnsavedExpense = computed(() => expense.id < 0);
</script>

<template>
  <div
    :data-expense-id="expense.id"
    class="grid grid-cols-12 border-t border-b border-l even:border-t-0 even:border-b-0 border-gray-300 cursor-pointer hover:bg-gray-200"
    @click="emit('click')"
  >
    <div
      class="col-span-3 flex flex-col items-center justify-center text-white py-1"
      :class="{
        'bg-primary': !isUnsavedExpense,
        'bg-amber-500': isUnsavedExpense,
      }"
    >
      <span class="font-bold text-sm">{{ expenseDay }} {{ expenseMonth }}</span>
      <span class="text-xs">{{ expenseTime }}</span>
    </div>

    <div class="col-span-6 flex flex-col p-2 overflow-hidden">
      <div class="flex items-center w-full">
        <fa-icon :icon="['fas', 'location-dot']" class="text-gray-800 shrink-0" />
        <span class="ml-2 truncate font-semibold">{{ expense.city.name }}</span>
      </div>
      <div class="mt-1 flex items-center w-full text-sm">
        <ExpenseCategoryIcon :category-id="expense.category.id" />
        <span class="ml-2 truncate">{{ expense.category.name }}</span>
      </div>
      <div class="mt-1 flex items-center w-full text-sm">
        <fa-icon :icon="['fas', expense.users.length === 1 ? 'user' : 'users']" class="text-gray-800" />
        <span class="ml-2 truncate">{{ userNames }}</span>
      </div>
    </div>

    <div class="col-span-3 flex items-center justify-center">
      <span class="font-bold text-sm"> <span v-if="!isUnsavedExpense">€</span>{{ expense.euroAmount }} </span>
    </div>
  </div>
</template>
