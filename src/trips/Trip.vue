<script setup lang="ts">
import type { Trip } from "@/api/trip";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { format, differenceInDays } from "date-fns";

const { trip } = defineProps<{
  trip: Trip;
}>();

const router = useRouter();

const today = new Date();
today.setHours(0, 0, 0, 0);

const startDate = computed(() => new Date(trip.startDate));
const endDate = computed(() => new Date(trip.endDate));

const isUpcoming = computed(() => {
  const start = new Date(trip.startDate);
  start.setHours(0, 0, 0, 0);
  return start > today;
});

const isPast = computed(() => {
  const end = new Date(trip.endDate);
  end.setHours(23, 59, 59, 999);
  return end < today;
});

const isActive = computed(() => {
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return today >= start && today <= end;
});

const daysUntil = computed(() => Math.max(0, differenceInDays(startDate.value, today)));

const formattedDateRange = computed(() => {
  const start = format(startDate.value, "MMM d");
  const end = format(endDate.value, "MMM d, yyyy");
  return `${start} - ${end}`;
});

const formattedAmount = computed(() => {
  const amount =
    typeof trip.totalExpenseAmount === "number"
      ? trip.totalExpenseAmount
      : parseFloat(trip.totalExpenseAmount as string) || 0;
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
});

const onClick = () => {
  router.push({ name: "tripData", params: { tripId: trip.id } });
};
</script>

<template>
  <article
    class="et-trip-card"
    :class="{
      'et-trip-card--upcoming': isUpcoming,
      'et-trip-card--active': isActive,
      'et-trip-card--past': isPast,
    }"
    @click="onClick"
  >
    <!-- Hero Image with Gradient Overlay -->
    <div class="et-trip-card__image">
      <div
        class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        :style="{ backgroundImage: `url(${trip.image})` }"
      />
      <!-- Gradient overlay for text readability -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <!-- Status Badge (top-left) -->
      <div class="absolute top-3 left-3">
        <span v-if="isActive" class="et-trip-badge et-trip-badge--active">
          <span class="et-trip-badge__dot animate-pulse" />
          Now
        </span>
        <span v-else-if="isUpcoming" class="et-trip-badge et-trip-badge--upcoming">
          In {{ daysUntil }} day{{ daysUntil !== 1 ? "s" : "" }}
        </span>
      </div>
    </div>

    <!-- Content Area (overlaid on bottom of image) -->
    <div class="et-trip-card__content">
      <!-- Trip Name -->
      <h3 class="et-trip-card__title">{{ trip.name }}</h3>

      <!-- Meta Row -->
      <div class="et-trip-card__meta">
        <!-- Date Range -->
        <div class="et-trip-card__dates">
          <fa-icon :icon="['fas', 'calendar']" class="w-3.5 h-3.5" />
          <span>{{ formattedDateRange }}</span>
        </div>

        <!-- Expense Amount -->
        <div class="et-trip-card__expense">
          <span class="et-trip-card__expense-label">Spent</span>
          <span class="et-trip-card__expense-amount">{{ formattedAmount }}</span>
        </div>
      </div>
    </div>

    <!-- Hover Indicator -->
    <div class="et-trip-card__indicator" />
  </article>
</template>
