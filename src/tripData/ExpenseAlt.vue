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
    :data-expense-id="expense.id"
    class="grid grid-cols-[3.25rem,1fr,auto] gap-3 items-stretch border-b border-gray-200 px-3 py-2 cursor-pointer hover:bg-gray-600 last:border-b-0"
    :class="{
      'bg-amber-700': isUnsavedExpense,
    }"
    @click="emit('click')"
  >
    <!-- Middle: Details -->
    <div class="flex flex-col overflow-hidden">
      <!-- Top row: location + amount -->
      <div class="flex items-center gap-2">
        <div class="flex items-center min-w-0 gap-1.5">
          <fa-icon :icon="['fas', 'location-dot']" class="text-gray-300 shrink-0" />
          <span class="truncate font-semibold text-sm text-white">
            {{ expense.city.name }}
          </span>
        </div>

        <!-- Amount, right aligned inside middle column on larger screens -->
        <span class="ml-auto font-semibold text-sm text-gray-300">
          <span v-if="!isUnsavedExpense">€</span>{{ expense.euroAmount }}
        </span>
      </div>

      <!-- Bottom row: category + users -->
      <div class="mt-1 flex items-center gap-2 min-w-0">
        <span
          class="inline-flex items-center rounded-full bg-primary text-primary-content pl-1 pr-2 py-0.5 text-[0.75rem] text-gray-700 shrink-0"
        >
          <fa-icon :icon="['fas', 'clock']" class="text-gray-800" />
          <span class="truncate max-w-[10rem]">
            {{ expenseTime }}
          </span>
        </span>
        <!-- Category pill -->
        <span
          class="inline-flex items-center gap-1 rounded-full bg-secondary text-secondary-content px-2 py-0.5 text-[0.75rem] text-gray-700 shrink-0"
        >
          <ExpenseCategoryIcon :category-id="expense.category.id" class="h-3 w-3" />
          <span class="truncate max-w-[10rem]">
            {{ expense.category.name }}
          </span>
        </span>

        <!-- Users (stacked initials) -->
        <div class="flex items-center gap-1 ml-auto pb-1 pr-1">
          <!-- One or two users as small bubbles, more as a count -->
          <template v-if="expense.users.length === 1">
            <div
              class="h-6 w-6 rounded-full bg-success text-success-content flex items-center justify-center text-[0.7rem] font-bold ring-1"
            >
              {{ userInitals }}
            </div>
          </template>

          <template v-else-if="expense.users.length === 2">
            <div class="flex -space-x-2">
              <div
                v-for="u in expense.users"
                :key="u.id"
                class="h-6 w-6 rounded-full bg-success text-success-content flex items-center justify-center text-[0.7rem] font-bold ring-1 ring-white"
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
                class="h-6 w-6 rounded-full bg-success text-success-content flex items-center justify-center text-[0.7rem] font-bold ring-1 ring-white"
              >
                {{ `${u.firstName[0]}${u.lastName[0]}`.toUpperCase() }}
              </div>
              <div
                class="h-6 w-6 rounded-full bg-success text-success-content flex items-center justify-center text-[0.7rem] font-semibold ring-1 ring-white"
              >
                +{{ expense.users.length - 2 }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
