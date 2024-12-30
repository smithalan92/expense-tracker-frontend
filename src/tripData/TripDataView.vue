<script setup lang="ts">
import { deleteTrip } from "@/api/trip";
import Spinner from "@/app/Spinner.vue";
import ConfirmModal from "@/modal/ConfirmModal.vue";
import useTripData from "@/stores/tripDataStore";
import AddOrEditTripModal from "@/trips/AddOrEditTripModal.vue";
import { useToast } from "@/utils/useToast";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AddOrEditExpenseModal from "./AddOrEditExpenseModal.vue";
import ExpenseList from "./ExpenseList.vue";
import useGetCurrentTripId from "./hooks/useGetCurrentTripId";

const toast = useToast();
const router = useRouter();
const store = useTripData();
const { trip, hasUnsavedExpenses, isLoadingTripData, hasFailedToLoadTripData } = storeToRefs(store);
const { loadTripData, resetState, syncUnsavedExpenses } = store;
const currentTripID = useGetCurrentTripId();
const isEditTripModalOpen = ref(false);
const showConfirmDelete = ref(false);
const showAddExpenseModal = ref(false);
const isSyncingExpenses = ref(false);

const onClickDelete = async () => {
  try {
    await deleteTrip(trip.value.id);
    resetState();
    router.push("/");
  } catch (err) {
    console.log(err);
    toast.error("Failed to delete trip.");
  }
};

const onClickSyncExpenses = async () => {
  try {
    isSyncingExpenses.value = true;
    await syncUnsavedExpenses();
    toast.success("Expenses have been sync'd");
  } catch (err) {
    console.error(err);
    toast.error("Failed to sync expenses");
  } finally {
    isSyncingExpenses.value = false;
  }
};

onMounted(() => {
  loadTripData(currentTripID.value);
});
</script>

<template>
  <div class="w-full h-full">
    <Spinner v-if="isLoadingTripData || isSyncingExpenses" :use-overlay="true" />

    <div v-if="hasFailedToLoadTripData" class="h-full overflow-hidden pt-4 flex flex-col">
      <div class="flex space-between mb-4">
        <div class="flex flex-1">
          <button name="back" class="px-1 hover:opacity-70" @click="router.go(-1)">
            <fa-icon :icon="['fas', 'arrow-left']" size="lg" class="text-primary" />
          </button>
          <button
            name="refresh"
            class="ml-2 px-1 text-primary hover:opacity-70"
            @click="loadTripData(currentTripID)"
          >
            <fa-icon :icon="['fas', 'rotate-right']" size="lg" class="text-primary" />
          </button>
        </div>
      </div>
      <div class="flex flex-col flex-1 items-center mt-12">
        <fa-icon class="text-red-500" :icon="['fas', 'triangle-exclamation']" size="2xl" />
        <span class="mt-4">Something went wrong loading this trip.</span>
      </div>
    </div>

    <div
      v-if="!isLoadingTripData && !hasFailedToLoadTripData && trip"
      class="h-full overflow-hidden pt-4 flex flex-col"
    >
      <div class="text-center font-bold text-2xl mb-2">{{ trip.name }}</div>
      <div class="text-center text-md mb-4">{{ trip.startDate }} to {{ trip.endDate }}</div>
      <div class="flex space-between mb-4">
        <div class="flex flex-1">
          <button name="back" class="px-1 hover:opacity-70" @click="router.go(-1)">
            <fa-icon :icon="['fas', 'arrow-left']" size="lg" class="text-primary" />
          </button>
          <button
            name="refresh"
            class="ml-2 px-1 text-primary hover:opacity-70"
            @click="loadTripData(currentTripID)"
          >
            <fa-icon :icon="['fas', 'rotate-right']" size="lg" class="text-primary" />
          </button>
        </div>
        <div class="flex">
          <button
            name="edit-trip"
            class="ml-2 px-1 text-primary hover:opacity-70"
            @click="isEditTripModalOpen = true"
          >
            <fa-icon :icon="['fas', 'pen-to-square']" size="lg" />
          </button>
          <button
            name="delete-trip"
            class="ml-2 px-1 text-red-500 hover:opacity-70"
            @click="showConfirmDelete = true"
          >
            <fa-icon :icon="['fas', 'trash-can']" size="lg" />
          </button>
        </div>
      </div>
      <div class="overflow-x-auto flex-1">
        <ExpenseList />
      </div>
      <div class="flex justify-center py-6">
        <button class="btn btn-primary font-bold text-md text-white" @click="showAddExpenseModal = true">
          <fa-icon :icon="['fas', 'plus']" class="w-6 mr-1" size="xl" />
          Expense
        </button>
        <button
          v-if="hasUnsavedExpenses"
          class="btn font-bold text-md text-white ml-4 bg-amber-500 hover:bg-amber-400"
          @click="onClickSyncExpenses"
        >
          <fa-icon :icon="['fas', 'rotate']" class="w-6 mr-1" size="xl" />
          Sync
        </button>
      </div>
    </div>
  </div>
  <AddOrEditTripModal
    v-if="isEditTripModalOpen"
    :trip-id-to-edit="currentTripID"
    @close="isEditTripModalOpen = false"
  />
  <AddOrEditExpenseModal v-if="showAddExpenseModal" @close="showAddExpenseModal = false" />
  <ConfirmModal
    v-if="showConfirmDelete"
    type="danger"
    title="Confirm delete"
    @confirm="onClickDelete"
    @cancel="showConfirmDelete = false"
  >
    <template #body>
      <div class="px-4 py-8 flex items-center justify-center text-center">
        <p>
          Are you sure you want to delete "<span class="font-bold">{{ trip.name }}</span
          >"
        </p>
      </div>
    </template>
  </ConfirmModal>
</template>
