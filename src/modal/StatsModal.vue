<script setup lang="ts">
import { getTripStats } from "@/api/trip";
import Modal from "@/modal/Modal.vue";
import useAppStore from "@/stores/appStore";
import useTripDataStore from "@/stores/tripDataStore";
import useUserPreferencesStore from "@/stores/userPreferencesStore";
import useGetCurrentTripId from "@/tripData/hooks/useGetCurrentTripId";

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { useAlternativeUI } = useUserPreferencesStore();

const { categories } = useTripDataStore();
const { users } = useAppStore();

const tripId = useGetCurrentTripId();

const { data } = await getTripStats(tripId.value);
</script>
<template>
  <Modal @close="emit('close')" title="Stats" :include-close-button="true">
    <template v-slot:body>
      <div class="overflow-x-auto py-4">
        <h1 class="font-bold">Total Spending</h1>
        <table class="table mt-2 mb-6">
          <!-- head -->
          <thead>
            <tr>
              <th>User</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in data.totalExpensesByUser">
              <td>{{ user.firstName }} {{ user.lastName }}</td>
              <td>€{{ user.totalEuroAmount }}</td>
            </tr>
          </tbody>
        </table>

        <h1 class="font-bold">Spending by Category</h1>
        <table class="table mt-2">
          <thead>
            <tr>
              <th>Category</th>
              <th v-for="user in users">
                {{ user.firstName }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories">
              <td>{{ category.name }}</td>
              <td v-for="user in users">
                €{{ data.categoryExpensesByUser[user.id]?.categories[category.id] ?? 0 }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </Modal>
</template>
