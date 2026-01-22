<script setup lang="ts">
import Spinner from "@/app/Spinner.vue";
import useTripsStore from "@/stores/tripsStore";
import { onMounted, ref, computed } from "vue";
import AddOrEditTripModal from "./AddOrEditTripModal.vue";
import Trip from "./Trip.vue";

const isAddTripModalOpen = ref(false);
const tripsStore = useTripsStore();

const openAddTripModal = () => {
  isAddTripModalOpen.value = true;
};

const closeAddTripModal = () => {
  isAddTripModalOpen.value = false;
};

const today = new Date();
today.setHours(0, 0, 0, 0);

const parseDate = (dateStr: string) => {
  // Handle both "YYYY-MM-DD" and other formats
  const d = new Date(dateStr);
  return d;
};

const activeTrips = computed(() => {
  return tripsStore.getTrips.filter((trip) => {
    const start = parseDate(trip.startDate);
    const end = parseDate(trip.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return today >= start && today <= end;
  });
});

const upcomingTrips = computed(() => {
  return tripsStore.getTrips.filter((trip) => {
    const start = parseDate(trip.startDate);
    start.setHours(0, 0, 0, 0);
    return start > today;
  });
});

const pastTrips = computed(() => {
  return tripsStore.getTrips.filter((trip) => {
    const end = parseDate(trip.endDate);
    end.setHours(23, 59, 59, 999);
    return end < today;
  });
});

const tripCount = computed(() => tripsStore.trips.length);

const hasTrips = computed(
  () => !tripsStore.isLoading && !tripsStore.hasFailedToLoad && tripsStore.trips.length > 0
);

onMounted(() => {
  tripsStore.loadTrips();
});
</script>

<template>
  <div class="et-trips-view">
    <!-- Page Header -->
    <header class="et-trips-header">
      <div class="et-trips-header__content">
        <div class="flex items-center gap-3">
          <div class="et-trips-header__icon">
            <fa-icon :icon="['fas', 'plane-departure']" />
          </div>
          <div>
            <h1 class="et-trips-header__title">My Trips</h1>
            <p v-if="hasTrips" class="et-trips-header__subtitle">
              {{ tripCount }} trip{{ tripCount !== 1 ? "s" : "" }}
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="et-trips-main">
      <!-- Loading State -->
      <div v-if="tripsStore.isLoading" class="et-trips-loading">
        <div class="et-trips-loading__content">
          <Spinner />
          <p class="et-trips-loading__text">Loading your adventures...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="tripsStore.hasFailedToLoad" class="et-trips-error">
        <div class="et-trips-error__content">
          <div class="et-trips-error__icon">
            <fa-icon :icon="['fas', 'triangle-exclamation']" />
          </div>
          <h2 class="et-trips-error__title">Unable to load trips</h2>
          <p class="et-trips-error__text">Check your connection and try again</p>
          <button class="et-btn-primary mt-4" @click="tripsStore.loadTrips">
            <fa-icon :icon="['fas', 'rotate-right']" class="mr-2" />
            Retry
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!tripsStore.isLoading && tripsStore.trips.length === 0"
        class="et-trips-empty"
      >
        <div class="et-trips-empty__content">
          <div class="et-trips-empty__illustration">
            <fa-icon :icon="['fas', 'plane-departure']" />
          </div>
          <h2 class="et-trips-empty__title">No trips yet</h2>
          <p class="et-trips-empty__text">
            Start tracking your travel expenses by adding your first trip
          </p>
          <button class="et-btn-primary mt-6" @click="openAddTripModal">
            <fa-icon :icon="['fas', 'plus']" class="mr-2" />
            Add Your First Trip
          </button>
        </div>
      </div>

      <!-- Trip List with Segments -->
      <div v-else class="et-trips-list">
        <!-- Active Trips (if any) -->
        <section v-if="activeTrips.length > 0" class="et-trips-section">
          <h2 class="et-trips-section__title">
            <span class="et-trips-section__icon--active animate-pulse" />
            Happening Now
          </h2>
          <div class="et-trips-grid">
            <Trip v-for="trip in activeTrips" :key="trip.id" :trip="trip" />
          </div>
        </section>

        <!-- Upcoming Trips -->
        <section v-if="upcomingTrips.length > 0" class="et-trips-section">
          <h2 class="et-trips-section__title">
            <fa-icon :icon="['fas', 'calendar-day']" class="et-trips-section__icon" />
            Upcoming
          </h2>
          <div class="et-trips-grid">
            <Trip v-for="trip in upcomingTrips" :key="trip.id" :trip="trip" />
          </div>
        </section>

        <!-- Past Trips -->
        <section v-if="pastTrips.length > 0" class="et-trips-section">
          <h2 class="et-trips-section__title">
            <fa-icon :icon="['fas', 'clock-rotate-left']" class="et-trips-section__icon" />
            Past Trips
          </h2>
          <div class="et-trips-grid">
            <Trip v-for="trip in pastTrips" :key="trip.id" :trip="trip" />
          </div>
        </section>

        <!-- Fallback: Show all trips if none match segments (shouldn't happen) -->
        <section v-if="activeTrips.length === 0 && upcomingTrips.length === 0 && pastTrips.length === 0" class="et-trips-section">
          <h2 class="et-trips-section__title">
            <fa-icon :icon="['fas', 'suitcase']" class="et-trips-section__icon" />
            All Trips
          </h2>
          <div class="et-trips-grid">
            <Trip v-for="trip in tripsStore.getTrips" :key="trip.id" :trip="trip" />
          </div>
        </section>
      </div>
    </main>

    <!-- Floating Action Button (FAB) -->
    <button
      v-if="hasTrips"
      class="et-fab"
      @click="openAddTripModal"
      aria-label="Add new trip"
    >
      <fa-icon :icon="['fas', 'plus']" />
    </button>

    <AddOrEditTripModal v-if="isAddTripModalOpen" @close="closeAddTripModal" />
  </div>
</template>
