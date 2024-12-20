<script setup lang="ts">
import type { TripExpense } from "@/api";
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
const userInitals = computed(() => {
  const firstNameLetter = expense.user.firstName.slice(0, 1).toUpperCase();
  const lastNameLetter = expense.user.lastName.slice(0, 1).toUpperCase();
  return `${firstNameLetter}${lastNameLetter}`;
});
const isUnsavedExpense = computed(() => expense.id < 0);
</script>

<template>
  <div
    :data-expense-id="expense.id"
    class="flex border-t border-b border-l even:border-t-0 even:border-b-0 border-solid border-gray-300 cursor-pointer hover:bg-gray-200"
    @click="emit('click')"
  >
    <div
      class="flex px-1 py-1 bg-primary text-white border-b border-solid border-white"
      :class="{
        'bg-amber-500': isUnsavedExpense,
      }"
    >
      <div class="flex h-full flex-col items-center justify-center w-16">
        <span class="font-bold text-sm"> {{ expenseDay }} {{ expenseMonth }} </span>
        <span class="text-xs">{{ expenseTime }}</span>
      </div>
    </div>
    <div class="flex flex-1 flex-col p-2 flex-nowrap overflow-hidden">
      <div class="flex items-center w-full flex-nowrap">
        <fa-icon :icon="['fas', 'location-dot']" class="text-gray-800" />
        <span class="ml-2 whitespace-nowrap text-ellipsis overflow-hidden font-semibold">
          {{ expense.city.name }}
        </span>
      </div>
      <div class="mt-1 flex items-center w-full flex-nowrap">
        <ExpenseCategoryIcon :category-id="expense.category.id" />
        <span class="ml-2 whitespace-nowrap text-ellipsis overflow-hidden">
          {{ expense.category.name }}
        </span>
      </div>
    </div>
    <div class="flex items-center justify-center px-4">
      <span class="font-bold"><span v-if="!isUnsavedExpense">€</span>{{ expense.euroAmount }}</span>
    </div>
    <div
      class="flex items-center justify-center bg-primary w-10"
      :class="{
        'bg-amber-500': isUnsavedExpense,
      }"
    >
      <span class="text-white font-bold">{{ userInitals }}</span>
    </div>
  </div>
</template>
