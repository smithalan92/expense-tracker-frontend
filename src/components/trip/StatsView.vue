<script setup lang="ts">
import type { ExpenseUser } from "@/api/expense";
import Progress from "@/components/ui/progress/Progress.vue";
import useTripData from "@/store/tripDataStore";
import { BanknoteX } from "@lucide/vue";
import { format } from "date-fns";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import AvatarGroup from "./AvatarGroup.vue";
import ExpenseCategoryChip from "./ExpenseCategoryChip.vue";

const props = defineProps<{ class?: string }>();

const store = useTripData();
const { getExpenses } = storeToRefs(store);

const formatEuro = (amount: number) =>
  Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" }).format(amount);

const total = computed(() =>
  getExpenses.value.reduce((acc, exp) => acc + parseFloat(exp.euroAmount), 0),
);

const byCategory = computed(() => {
  const map = new Map<number, { id: number; name: string; amount: number; count: number }>();

  for (const expense of getExpenses.value) {
    const existing = map.get(expense.category.id) ?? {
      id: expense.category.id,
      name: expense.category.name,
      amount: 0,
      count: 0,
    };

    existing.amount += parseFloat(expense.euroAmount);
    existing.count += 1;
    map.set(expense.category.id, existing);
  }

  return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
});

const byUser = computed(() => {
  const map = new Map<number, { user: ExpenseUser; amount: number; count: number }>();

  for (const expense of getExpenses.value) {
    // An expense is shared evenly between everyone attached to it
    const share = parseFloat(expense.euroAmount) / expense.users.length;

    for (const user of expense.users) {
      const existing = map.get(user.id) ?? {
        user,
        amount: 0,
        count: 0,
      };

      existing.amount += share;
      existing.count += 1;
      map.set(user.id, existing);
    }
  }

  return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
});

const byDay = computed(() => {
  const map = new Map<string, number>();

  for (const expense of getExpenses.value) {
    const date = format(new Date(expense.localDateTime), "yyyy-MM-dd");
    map.set(date, (map.get(date) ?? 0) + parseFloat(expense.euroAmount));
  }

  return Array.from(map.entries()).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
});

const busiestDay = computed(() => {
  return byDay.value.reduce<Nullable<[string, number]>>((acc, current) => {
    return !acc || current[1] > acc[1] ? current : acc;
  }, null);
});

const averagePerDay = computed(() => {
  if (!byDay.value.length) return 0;
  return total.value / byDay.value.length;
});

const percentOfTotal = (amount: number) => {
  if (!total.value) return 0;
  return (amount / total.value) * 100;
};
</script>

<template>
  <div
    class="overflow-y-auto overscroll-contain w-full flex-1 flex flex-col"
    :class="props.class"
    data-testid="stats-view"
  >
    <div v-if="!getExpenses.length" class="flex flex-col flex-1 justify-center items-center py-12">
      <BanknoteX class="mb-4 size-12" />
      <span>Nothing to show stats for just yet</span>
    </div>

    <template v-else>
      <!-- Headline numbers -->
      <div class="grid grid-cols-3 gap-3 px-6 pt-6">
        <div class="flex flex-col rounded-lg bg-surface-3 p-3">
          <span class="font-mono text-[10px] text-text-3 uppercase">Expenses</span>
          <span class="mt-1 font-mono text-lg">{{ getExpenses.length }}</span>
        </div>
        <div class="flex flex-col rounded-lg bg-surface-3 p-3">
          <span class="font-mono text-[10px] text-text-3 uppercase">Per Day</span>
          <span class="mt-1 font-mono text-lg">{{ formatEuro(averagePerDay) }}</span>
        </div>
        <div class="flex flex-col rounded-lg bg-surface-3 p-3">
          <span class="font-mono text-[10px] text-text-3 uppercase">Busiest</span>
          <span class="mt-1 font-mono text-lg">
            {{ busiestDay ? formatEuro(busiestDay[1]) : "—" }}
          </span>
          <span v-if="busiestDay" class="mt-1 text-[10px] text-text-3">
            {{ format(new Date(busiestDay[0]), "MMM do") }}
          </span>
        </div>
      </div>

      <!-- By category -->
      <div class="px-6 pt-8">
        <div class="font-display font-semibold text-sm">By category</div>
        <div class="flex flex-col gap-4 pt-4">
          <div v-for="category in byCategory" :key="category.id" class="flex items-center gap-3">
            <ExpenseCategoryChip :category-id="category.id" variant="box" />
            <div class="flex flex-1 flex-col overflow-hidden">
              <div class="flex justify-between text-sm">
                <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{ category.name }}</span>
                <span class="font-mono">{{ formatEuro(category.amount) }}</span>
              </div>
              <Progress
                :model-value="percentOfTotal(category.amount)"
                class="mt-2 h-[6px] bg-surface-3"
                :aria-label="`${category.name} share of total spend`"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- By person -->
      <div class="px-6 pt-8 pb-4">
        <div class="font-display font-semibold text-sm">By person</div>
        <div class="flex flex-col gap-4 pt-4">
          <div v-for="entry in byUser" :key="entry.user.id" class="flex items-center gap-3">
            <AvatarGroup :users="[entry.user]" />
            <div class="flex flex-1 flex-col overflow-hidden">
              <div class="flex justify-between text-sm">
                <span class="overflow-hidden text-ellipsis whitespace-nowrap">
                  {{ entry.user.firstName }}
                </span>
                <span class="font-mono">{{ formatEuro(entry.amount) }}</span>
              </div>
              <Progress
                :model-value="percentOfTotal(entry.amount)"
                class="mt-2 h-[6px] bg-surface-3"
                :aria-label="`${entry.user.firstName} share of total spend`"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
