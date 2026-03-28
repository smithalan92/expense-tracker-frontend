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
    class="grid grid-cols-[3.25rem,1fr,auto] gap-3 items-stretch border-b border-slate-700/50 px-3 py-2 cursor-pointer hover:bg-slate-700/30 last:border-b-0 transition-colors"
    :class="{
      'bg-amber-700': isUnsavedExpense,
    }"
    @click="emit('click')"
  >
    <!-- Middle: Details -->
    <div class="flex flex-col overflow-hidden">
      <!-- Top row: location + amount -->
      <div class="flex items-center gap-2">
        <div class="flex flex-col">
          <div class="flex items-center min-w-0 gap-1.5">
            <!-- Category pill -->
            <ExpenseCategoryIcon :category-id="expense.category.id" class="h-3 w-3" />
            <span class="truncate max-w-[10rem]">
              {{ expense.category.name }}
            </span>
          </div>
          <span class="text-xs text-gray-400 italic capitalize">
            {{ expense.description }}
          </span>
        </div>

        <!-- Amount, right aligned inside middle column on larger screens -->
        <span class="ml-auto font-semibold text-sm text-gray-300">
          <span v-if="!isUnsavedExpense">€</span>{{ expense.euroAmount }}
        </span>
      </div>

      <!-- Bottom row: location + users -->
      <div class="mt-1 flex items-center gap-2 min-w-0">
        <span class="et-pill-primary pl-1 pr-2">
          <fa-icon :icon="['fas', 'clock']" class="text-sky-300" />
          <span class="truncate max-w-[10rem]">
            {{ expenseTime }}
          </span>
        </span>
        <span class="et-pill-secondary">
          <fa-icon :icon="['fas', 'location-dot']" class="text-gray-300 shrink-0" />
          <span class="truncate font-semibold text-sm text-white">
            {{ expense.country.name }}
          </span>
        </span>

        <!-- Users (stacked initials) -->
        <div class="flex items-center gap-1 ml-auto pb-1 pr-1">
          <!-- One or two users as small bubbles, more as a count -->
          <template v-if="expense.users.length === 1">
            <div
              class="h-6 w-6 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center text-[0.7rem] font-bold ring-1 ring-emerald-900"
            >
              {{ userInitals }}
            </div>
          </template>

          <template v-else-if="expense.users.length === 2">
            <div class="flex -space-x-2">
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
      </div>
    </div>
  </div>
</template>
