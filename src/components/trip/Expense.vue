<script setup lang="ts">
import type { TripExpense } from "@/api/expense";
import { MapPin } from "@lucide/vue";
import { format } from "date-fns";
import { computed } from "vue";
import AvatarGroup from "./AvatarGroup.vue";
import ExpenseCategoryIcon from "./ExpenseCategoryIcon.vue";

const { expense } = defineProps<{
  expense: TripExpense;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

const date = computed(() => new Date(expense.localDateTime));
const expenseTime = computed(() => format(date.value, "HH:mm"));
const isUnsavedExpense = computed(() => expense.id < 0);
</script>

<template>
  <div
    :data-testid="`expense-${expense.id}`"
    class="grid grid-cols-[0.5fr_3.75fr_0.5fr_1.5fr] gap-5 items-stretch border-b border-slate-700/50 py-2 cursor-pointer last:border-b-0"
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
      <AvatarGroup :users="expense.users" />
    </div>

    <div class="flex flex-col items-end justify-center text-right">
      <div class="text-sm">€{{ expense.euroAmount }}</div>
      <div v-if="expense.currency.code !== 'EUR'" class="text-[11px]">
        {{ `${expense.amount} ${expense.currency.code}` }}
      </div>
    </div>
  </div>
</template>
