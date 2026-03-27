<script setup lang="ts">
import { type TripExpense } from "@/api/expense";
import Spinner from "@/app/Spinner.vue";
import ConfirmModal from "@/modal/ConfirmModal.vue";
import Modal from "@/modal/Modal.vue";
import useTripDataStore from "@/stores/tripDataStore";
import { useToast } from "@/utils/useToast";
import { useOnline } from "@vueuse/core";
import { format } from "date-fns";
import { computed, ref, toRefs } from "vue";
import useViewExpenseData from "./hooks/useViewExpenseData";

const props = defineProps<{
  expense: TripExpense;
}>();

const emit = defineEmits<{
  (id: "edit"): void;
  (id: "close"): void;
  (id: "copy"): void;
}>();

const { expense } = toRefs(props);
const $toast = useToast();
const { deleteExpense } = useTripDataStore();
const isOnline = useOnline();

const canEditAndDeleteExpense = computed(() => {
  return isOnline.value || expense.value.id < 0;
});

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

const onClickEdit = () => {
  emit("edit");
  emit("close");
};

const onClickConfirm = async () => {
  if (shouldShowDeleteModal.value) {
    shouldShowDeleteModal.value = false;
    isDeletingExpense.value = true;

    try {
      await deleteExpense(expense.value.id);
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
    emit("close");
  }
};

const onCloseConfirm = () => {
  if (shouldShowDeleteModal.value) shouldShowDeleteModal.value = false;
  else if (shouldShowCopyModal.value) shouldShowCopyModal.value = false;
};

const dataToDisplay = useViewExpenseData(expense);
</script>
<template>
  <Modal :includeCloseButton="true" :height="330" alignFooter="space-between" @close="emit('close')">
    <template #title>
      <div class="flex flex-col items-center flex-1">
        <span class="font-bold text-2xl">{{ expenseDateAndTime.date }}</span>
        <span class="font-bold text-md">{{ expenseDateAndTime.time }}</span>
      </div>
    </template>

    <template #alert v-if="!isOnline && expense.id > 0">
      <div class="flex-1 text-center font-bold text-sm p-4 et-alert-warning">
        Some actions are unavailable if you're offline.
      </div>
    </template>

    <template #body>
      <div class="flex flex-col py-2">
        <div
          v-for="item in dataToDisplay"
          class="flex flex-1 py-2 items-center border-b border-dashed border-sky-600/50 last:border-0"
          :key="item.label"
        >
          <div class="flex items-center flex-col border-r border-dashed border-sky-600/50 w-20 pr-3">
            <fa-icon class="w-6 text-slate-400" :icon="item.icon" />
            <span class="text-[10px] mt-1 font-bold text-slate-400">{{ item.label }}</span>
          </div>
          <div class="flex-1 ml-6 text-sm text-slate-200">{{ item.value }}</div>
        </div>
      </div>
    </template>

    <template #footer>
      <button
        class="flex items-center py-2 px-4 text-md hover:underline text-sky-400 font-bold disabled:text-gray-500 disabled:hover:no-underline transition-colors"
        :disabled="!canEditAndDeleteExpense"
        @click="onClickEdit"
      >
        <fa-icon :icon="['fas', 'pen-to-square']" />
        <span class="ml-2">Edit</span>
      </button>
      <button
        class="flex items-center py-2 px-4 text-md hover:underline text-sky-400 font-bold disabled:text-gray-500 disabled:hover:no-underline transition-colors"
        @click="shouldShowCopyModal = true"
      >
        <fa-icon :icon="['far', 'copy']" />
        <span class="ml-2">Copy</span>
      </button>
      <button
        class="flex items-center py-2 px-4 text-md text-rose-400 hover:underline font-bold disabled:text-gray-500 disabled:hover:no-underline transition-colors"
        :disabled="!canEditAndDeleteExpense"
        @click="shouldShowDeleteModal = true"
      >
        <fa-icon :icon="['fas', 'trash-can']" />
        <span class="ml-2">Delete</span>
      </button>
    </template>
  </Modal>
  <ConfirmModal
    v-if="shouldShowCopyModal || shouldShowDeleteModal"
    :title="confirmModalTitle"
    :type="shouldShowDeleteModal ? 'danger' : undefined"
    @confirm="onClickConfirm"
    @cancel="onCloseConfirm"
  >
    <template #body>{{ confirmModalBody }}</template>
  </ConfirmModal>
  <Spinner v-if="isDeletingExpense" :useOverlay="true" />
</template>
