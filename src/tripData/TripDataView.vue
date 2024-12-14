<script setup lang="ts">
import { deleteTrip } from "@/api";
import Spinner from "@/app/Spinner.vue";
import DeleteModal from "@/modal/DeleteModal.vue";
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
const { trip, isLoading, hasFailedToLoad } = storeToRefs(store);
const { loadTrip, resetState } = store;
const currentTripID = useGetCurrentTripId();
const isEditTripModalOpen = ref(false);
const showConfirmDelete = ref(false);
const showAddExpenseModal = ref(false);

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

onMounted(() => {
  loadTrip(currentTripID.value);
});
</script>

<template>
  <div class="w-full h-full">
    <Spinner v-if="isLoading" :use-overlay="true" />

    <div v-if="hasFailedToLoad" class="text-center">
      Something went wrong loading expenses. Please refresh the page and try again.
    </div>

    <div v-if="!isLoading && !hasFailedToLoad" class="h-full overflow-hidden pt-4 flex flex-col">
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
            @click="loadTrip(currentTripID)"
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
        <button
          class="btn btn-primary font-bold text-md text-white"
          @click="showAddExpenseModal = true"
        >
          <fa-icon :icon="['fas', 'plus']" class="w-6 mr-1" size="xl" /> Expense
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
  <DeleteModal v-if="showConfirmDelete" @delete="onClickDelete" @cancel="showConfirmDelete = false">
    <div class="px-4 py-8 flex items-center justify-center text-center">
      <p>
        Are you sure you want to delete "<span class="font-bold">{{ trip.name }}</span
        >"
      </p>
    </div>
  </DeleteModal>
</template>
