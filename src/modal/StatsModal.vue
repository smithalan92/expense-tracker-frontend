<script setup lang="ts">
import { getTripStats } from "@/api/trip";
import Modal from "@/modal/Modal.vue";
import useAppStore from "@/stores/appStore";
import useTripDataStore from "@/stores/tripDataStore";
import useGetCurrentTripId from "@/tripData/hooks/useGetCurrentTripId";
import { computed } from "vue";

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { categories } = useTripDataStore();
const { users } = useAppStore();

const tripId = useGetCurrentTripId();

const { data } = await getTripStats(tripId.value);

// Sort users by total spent (descending)
const sortedUserStats = computed(() => {
  return [...data.totalExpensesByUser].sort((a, b) => b.totalEuroAmount - a.totalEuroAmount);
});

// Calculate total spending across all users
const totalSpent = computed(() => {
  return data.totalExpensesByUser.reduce((sum, user) => sum + user.totalEuroAmount, 0);
});

// Get max amount for progress bar scaling
const maxAmount = computed(() => {
  return Math.max(...data.totalExpensesByUser.map((u) => u.totalEuroAmount), 1);
});

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Calculate percentage of total
const getPercentage = (amount: number) => {
  if (totalSpent.value === 0) return 0;
  return Math.round((amount / totalSpent.value) * 100);
};

// Get progress bar width
const getProgressWidth = (amount: number) => {
  return (amount / maxAmount.value) * 100;
};

// Calculate category totals
const getCategoryTotal = (categoryId: number) => {
  return Object.values(data.categoryExpensesByUser).reduce((sum, userExpenses) => {
    return sum + (userExpenses.categories[categoryId] ?? 0);
  }, 0);
};

// Get sorted categories by total spending
const sortedCategories = computed(() => {
  return [...categories].sort((a, b) => {
    const totalA = getCategoryTotal(a.id);
    const totalB = getCategoryTotal(b.id);
    return totalB - totalA;
  });
});

// Get color intensity based on amount
const getCellOpacity = (amount: number, categoryId: number) => {
  const categoryTotal = getCategoryTotal(categoryId);
  if (categoryTotal === 0) return 0;
  return (amount / categoryTotal) * 100;
};
</script>
<template>
  <Modal @close="emit('close')" title="Trip Stats" :include-close-button="true" :width="500">
    <template v-slot:body>
      <div class="py-2">
        <!-- Total Spending Section -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-bold text-slate-300 uppercase tracking-wide">Total Spending</h2>
            <div class="text-right">
              <div class="text-xs text-slate-400">Total</div>
              <div class="text-lg font-bold text-cyan-400">{{ formatCurrency(totalSpent) }}</div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <div
              v-for="(user, index) in sortedUserStats"
              :key="user.userId"
              class="rounded-xl p-4 transition-all duration-200"
              :class="{
                'bg-gradient-to-r from-cyan-600/20 to-cyan-600/5 border border-cyan-500/30': index === 0,
                'bg-slate-800/30 border border-slate-700/30': index !== 0,
              }"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div
                    v-if="index === 0"
                    class="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center"
                  >
                    <fa-icon :icon="['fas', 'crown']" class="text-cyan-400 text-xs" />
                  </div>
                  <span
                    class="font-semibold"
                    :class="index === 0 ? 'text-cyan-300' : 'text-slate-200'"
                  >
                    {{ user.firstName }} {{ user.lastName }}
                  </span>
                </div>
                <div class="text-right">
                  <div
                    class="text-lg font-bold"
                    :class="index === 0 ? 'text-cyan-400' : 'text-white'"
                  >
                    {{ formatCurrency(user.totalEuroAmount) }}
                  </div>
                  <div class="text-xs text-slate-400">{{ getPercentage(user.totalEuroAmount) }}%</div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="w-full h-2 bg-slate-900/50 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="index === 0 ? 'bg-gradient-to-r from-cyan-500 to-cyan-400' : 'bg-slate-600'"
                  :style="{ width: `${getProgressWidth(user.totalEuroAmount)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Spending by Category Section -->
        <div>
          <h2 class="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4">
            Spending by Category
          </h2>

          <div class="flex flex-col gap-3">
            <div
              v-for="category in sortedCategories"
              :key="category.id"
              class="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4"
            >
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-semibold text-slate-200">{{ category.name }}</h3>
                <div class="text-sm font-bold text-slate-300">
                  {{ formatCurrency(getCategoryTotal(category.id)) }}
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <div
                  v-for="user in users"
                  :key="user.id"
                  class="flex items-center justify-between text-sm"
                >
                  <div class="flex items-center gap-2 flex-1">
                    <div
                      class="w-1 h-4 rounded-full"
                      :style="{
                        backgroundColor: `rgba(6, 182, 212, ${getCellOpacity(data.categoryExpensesByUser[user.id]?.categories[category.id] ?? 0, category.id) / 100})`,
                      }"
                    ></div>
                    <span class="text-slate-400">{{ user.firstName }}</span>
                  </div>
                  <span class="font-medium text-slate-200 tabular-nums">
                    {{ formatCurrency(data.categoryExpensesByUser[user.id]?.categories[category.id] ?? 0) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>
