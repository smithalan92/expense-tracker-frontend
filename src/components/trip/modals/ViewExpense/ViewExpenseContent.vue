<script setup lang="ts">
import type { TripExpense } from "@/api/expense.ts";
import Button from "@/components/ui/button/Button.vue";
import Dialog from "@/components/ui/dialog/Dialog.vue";
import DialogContent from "@/components/ui/dialog/DialogContent.vue";
import DialogFooter from "@/components/ui/dialog/DialogFooter.vue";
import DialogHeader from "@/components/ui/dialog/DialogHeader.vue";
import DialogTitle from "@/components/ui/dialog/DialogTitle.vue";
import { DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import Separator from "@/components/ui/separator/Separator.vue";
import Spinner from "@/components/ui/spinner/Spinner.vue";
import useTripDataStore from "@/store/tripDataStore.ts";
import useUIStateStore from "@/store/uiState.ts";
import { useIsOnline } from "@/utils/network.ts";
import { Calendar, Copy, Edit, MapPin, Notebook, Trash, User, XCircle } from "@lucide/vue";
import { format } from "date-fns";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";
import ExpenseCategoryChip from "../../ExpenseCategoryChip.vue";

const isOnline = useIsOnline();

const { expense } = defineProps<{ expense: TripExpense }>();
const { setExpenseToEdit, setExpenseToView, setExpenseToCopy } = useUIStateStore();
const { deleteExpense } = useTripDataStore();

const isConfirmDeleteModalOpen = ref(false);
const isDeletingExpense = ref(false);

const onClose = () => {
  setExpenseToView(null);
  isConfirmDeleteModalOpen.value = false;
};

const onClickDelete = () => {
  isConfirmDeleteModalOpen.value = true;
};

const onClickEdit = () => {
  setExpenseToEdit(expense);
  onClose();
};

const onClickClone = () => {
  setExpenseToCopy(expense);
  onClose();
};

const onConfirmDelete = async () => {
  isDeletingExpense.value = true;
  try {
    await deleteExpense(expense.id);
    toast.success("Expense deleted.");
    onClose();
  } catch (err) {
    console.log(err);
    toast.error("Failed to delete expense.");
  } finally {
    isDeletingExpense.value = false;
  }
};

const date = computed(() => format(new Date(expense.localDateTime), "HH:mm, do MMM yyyy"));
const users = computed(() => expense.users.map((u) => u.firstName).join(", "));

const areActionsDisabled = computed(() => !isOnline.value && expense.id >= 0);
</script>
<template>
  <DrawerContent :disable-outside-pointer-events="true">
    <div class="mx-auto w-full max-w-sm">
      <DrawerHeader class="flex-row items-center space-between flex-1">
        <DrawerTitle class="flex-1 text-2xl">€{{ expense.euroAmount }}</DrawerTitle>
        <Button variant="ghost" @click="onClose">
          <XCircle class="size-6" />
        </Button>
      </DrawerHeader>
      <div class="flex flex-col text-muted-foreground text-sm px-4 mb-4">
        <div class="flex mt-2 items-center">
          <Notebook class="mr-1 size-[12px]" />
          <span v-if="expense.description.trim()">{{ expense.description }}</span>
          <span v-else class="italic">No description provided...</span>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <div class="flex items-center">
            <MapPin class="mr-1 size-[12px]" />
            {{ expense.city.name }}, {{ expense.country.name }}
          </div>
          <div class="h-4">
            <Separator orientation="vertical" />
          </div>
          <div class="flex items-center gap-1">
            <ExpenseCategoryChip
              :category-id="expense.category.id"
              class="inline-flex w-4 h-4"
              icon-class="size-[12px]"
              variant="box"
            />
            {{ expense!.category.name }}
          </div>
        </div>
        <div class="flex mt-2 items-center">
          <Calendar class="mr-1 size-[12px]" />
          <span>{{ date }}</span>
        </div>
        <div class="flex mt-2 items-center">
          <User class="mr-1 size-[12px]" />
          <span>{{ users }}</span>
        </div>
      </div>
      <DrawerFooter class="flex-1">
        <div class="grid grid-cols-3 gap-2 pb-2 relative">
          <div
            v-if="areActionsDisabled"
            class="absolute w-full bg-orange-800 rounded-sm flex items-center justify-center text-sm font-bold bottom-2 p-2 z-5"
          >
            Actions disabled when offline
          </div>
          <Button class="w-full" @click="onClickEdit" :disabled="areActionsDisabled">
            <Edit class="mr-1 size-[12px]" />
            Edit
          </Button>
          <Button variant="secondary" @click="onClickClone" :disabled="areActionsDisabled">
            <Copy class="mr-1 size-[12px]" />
            Copy
          </Button>
          <Button variant="destructive" @click="onClickDelete" :disabled="areActionsDisabled">
            <Trash class="mr-1 size-[12px]" />
            Delete
          </Button>
        </div>
      </DrawerFooter>
    </div>
  </DrawerContent>
  <Dialog v-model:open="isConfirmDeleteModalOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Confirm Delete</DialogTitle>
      </DialogHeader>
      <div class="flex items-center gap-2">
        <div class="text-center py-4">Are you sure you want to delete this expense?</div>
      </div>
      <DialogFooter>
        <Button variant="secondary" @click="isConfirmDeleteModalOpen = false">Cancel</Button>
        <Button variant="destructive" @click="onConfirmDelete">
          <Spinner class="text-white" v-if="isDeletingExpense" />
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
