<script setup lang="ts">
import { deleteExpense as apiDeleteExpense, type TripExpense } from "@/api";
import Spinner from "@/app/Spinner.vue";
import ConfirmModal from "@/modal/ConfirmModal.vue";
import Modal from "@/modal/Modal.vue";
import useTripDataStore from "@/stores/tripDataStore";
import { useToast } from "@/utils/useToast";
import { format } from "date-fns";
import { computed, ref, toRefs } from "vue";
import useGetCurrentTripId from "./hooks/useGetCurrentTripId";
import useViewExpenseData from "./hooks/useViewExpenseData";

const props = defineProps<{
  expense: TripExpense;
}>();

const { expense } = toRefs(props);
const currentTripID = useGetCurrentTripId();
const $toast = useToast();
const { deleteExpense } = useTripDataStore();

const emit = defineEmits<{
  (id: "edit"): void;
  (id: "close"): void;
  (id: "copy"): void;
}>();

const expenseDateAndTime = computed(() => {
  const date = new Date(expense.value.localDateTime);

  return {
    date: format(date, "do MMM yy"),
    time: format(date, "HH:mm"),
  };
});

const shouldShowDeleteModal = ref(false);
const shouldShowCopyModal = ref(false);
const isDeletingExpense = ref(false);

const confirmModalTitle = computed(() => {
  if (shouldShowDeleteModal.value) {
    return "Confirm delete?";
  }

  return "Copy expense?";
});

const confirmModalBody = computed(() => {
  const action = shouldShowDeleteModal.value ? "delete" : "copy";

  return `Are you sure you want to ${action} this expense?`;
});

const onClickConfirm = async () => {
  if (shouldShowDeleteModal.value) {
    shouldShowDeleteModal.value = false;
    isDeletingExpense.value = true;

    try {
      await apiDeleteExpense(currentTripID.value, expense.value.id);
      deleteExpense(expense.value.id);
      $toast.success("Your expense has been deleted.");
      emit("close");
    } catch (e) {
      $toast.error("Something went wrong deleting the expense. Try again.");
    } finally {
      isDeletingExpense.value = false;
    }
  } else if (shouldShowCopyModal.value) {
    shouldShowCopyModal.value = false;
    emit("copy");
  }
};

const onCloseConfirm = () => {
  if (shouldShowDeleteModal.value) shouldShowDeleteModal.value = false;
  else if (shouldShowCopyModal.value) shouldShowCopyModal.value = false;
};

const dataToDisplay = useViewExpenseData(expense);
</script>
<template>
  <Modal
    :includeCloseButton="true"
    :height="330"
    alignFooter="space-between"
    @close="emit('close')"
  >
    <template #title>
      <div class="flex flex-col items-center flex-1">
        <span class="font-bold text-2xl">{{ expenseDateAndTime.date }}</span>
        <span class="font-bold text-md">{{ expenseDateAndTime.time }}</span>
      </div>
    </template>

    <template #body>
      <div class="flex flex-col py-2">
        <div
          v-for="item in dataToDisplay"
          class="flex flex-1 py-2 items-center border-b border-dashed border-primary last:border-0"
          :key="item.label"
        >
          <div class="flex items-center flex-col border-r border-dashed border-primary w-20 pr-3">
            <fa-icon class="w-6" :icon="item.icon" />
            <span class="text-[10px] mt-1 font-bold">{{ item.label }}</span>
          </div>
          <div class="flex-1 ml-6 text-sm">{{ item.value }}</div>
        </div>
      </div>
    </template>

    <template #footer>
      <button
        class="flex items-center py-2 px-4 text-md mx-4 hover:underline text-primary font-bold"
        @click="emit('edit')"
      >
        <fa-icon :icon="['fas', 'pen-to-square']" class="fill-primary" />
        <span class="ml-2">Edit</span>
      </button>
      <button
        class="flex items-center py-2 px-4 text-md mx-4 hover:underline text-primary font-bold text-blue-400"
        @click="shouldShowCopyModal = true"
      >
        <fa-icon :icon="['far', 'copy']" class="fill-primary" />
        <span class="ml-2">Copy</span>
      </button>
      <button
        class="flex items-center py-2 px-4 text-md text-red-400 hover:underline font-bold"
        @click="shouldShowDeleteModal = true"
      >
        <fa-icon :icon="['fas', 'trash-can']" class="fill-primary" />
        <span class="ml-2">Delete</span>
      </button>
    </template>
  </Modal>
  <ConfirmModal
    v-if="shouldShowCopyModal || shouldShowDeleteModal"
    :title="confirmModalTitle"
    :type="shouldShowDeleteModal ? 'danger' : 'warning'"
    @confirm="onClickConfirm"
    @cancel="onCloseConfirm"
  >
    <template #body>{{ confirmModalBody }}</template>
  </ConfirmModal>
  <Spinner v-if="isDeletingExpense" :useOverlay="true" />
</template>
