<script setup lang="ts">
import type { TripExpense } from "@/api/expense";
import { MapPin } from "@lucide/vue";
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
const userInitals = computed(() => {
  if (expense.users.length === 1) {
    const [user] = expense.users;
    return `${user?.firstName.slice(0, 1)}${user?.lastName.slice(0, 1)}`.toUpperCase();
  }

  if (expense.users.length === 2) {
    const [firstUser, secondUser] = expense.users;

    return `${firstUser?.firstName.slice(0, 1)} & ${secondUser?.firstName.slice(0, 1)}`.toUpperCase();
  }

  return `(${expense.users.length})`;
});
const isUnsavedExpense = computed(() => expense.id < 0);
</script>

<template>
  <div
    :data-testid="`expense-${expense.id}`"
    class="grid grid-cols-[1fr_3.5fr_0.5fr_1.25fr] gap-5 items-stretch border-b border-slate-700/50 py-2 cursor-pointer last:border-b-0"
    :class="{
      'bg-amber-700': isUnsavedExpense,
    }"
    @click="emit('click')"
  >
    <div class="flex items-center justify-center">
      <ExpenseCategoryIcon :category-id="expense.category.id" />
    </div>

    <div class="flex flex-col overflow-hidden">
      <div class="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
        <span v-if="expense.description.trim()">{{ expense.description }}</span>
        <span v-else class="text-gray-500 italic">No description provided</span>
      </div>
      <div class="flex text-text-3 text-xs gap-3 pt-2">
        <div>
          {{ expenseTime }}
        </div>
        <div class="flex items-center"><MapPin class="mr-1 size-[10px]" /> {{ expense.city.name }}</div>
      </div>
    </div>

    <!-- Users (stacked initials) -->
    <div class="flex items-center justify-center">
      <!-- One or two users as small bubbles, more as a count -->
      <template v-if="expense.users.length === 1">
        <div
          class="h-6 w-6 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center text-[0.7rem] font-bold ring-1 ring-emerald-900"
        >
          {{ userInitals }}
        </div>
      </template>

      <template v-else-if="expense.users.length === 2">
        <div class="flex items-center justify-center">
          <div
            v-for="u in expense.users"
            :key="u.id"
            class="h-6 w-6 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center text-[0.7rem] font-bold ring-1 ring-slate-800"
          >
            {{ `${u.firstName[0]}${u.lastName[0]}`.toUpperCase() }}
          </div>
        </div>
      </template>

      <template v-else>
        <div class="flex -space-x-2">
          <div
            v-for="u in expense.users.slice(0, 2)"
            :key="u.id"
            class="h-6 w-6 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center text-[0.7rem] font-bold ring-1 ring-slate-800"
          >
            {{ `${u.firstName[0]}${u.lastName[0]}`.toUpperCase() }}
          </div>
          <div
            class="h-6 w-6 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center text-[0.7rem] font-semibold ring-1 ring-slate-800"
          >
            +{{ expense.users.length - 2 }}
          </div>
        </div>
      </template>
    </div>

    <div class="flex flex-col items-center justify-center">
      <div class="text-sm">€{{ expense.euroAmount }}</div>
      <div v-if="expense.currency.code !== 'EUR'" class="text-[9px]">
        {{ `${expense.amount} ${expense.currency.code}` }}
      </div>
    </div>
  </div>
</template>
