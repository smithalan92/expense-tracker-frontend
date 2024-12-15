<script setup lang="ts">
import type { TripExpense } from "@/api";
import Modal from "@/modal/Modal.vue";
import { format } from "date-fns";
import { computed } from "vue";

interface DataField {
  label: string;
  value: string | number;
  icon: string[];
}

const { expense } = defineProps<{
  expense: TripExpense;
}>();

const emit = defineEmits<{
  (id: "edit"): void;
}>();

const expenseDateAndTime = computed(() => {
  const date = new Date(expense.localDateTime);

  return {
    date: format(date, "do MMM yy"),
    time: format(date, "HH:mm"),
  };
});

const dataToDisplay = computed<DataField[]>(() => {
  return [
    {
      label: "Cost",
      value: `€${expense.euroAmount} / ${expense.amount} ${expense.currency.code}`,
      icon: ["fas", "tag"],
    },
    {
      label: "Category",
      value: expense.category.name,
      icon: ["fas", "layer-group"],
    },
    {
      label: "Location",
      value: `${expense.city.name}, ${expense.country.name}`,
      icon: ["fas", "location-dot"],
    },
    {
      label: "User",
      value: `${expense.user.firstName} ${expense.user.lastName}`,
      icon: ["fas", "user"],
    },
    {
      label: "Description",
      value: expense.description || "No description provided",
      icon: ["far", "clipboard"],
    },
  ];
});
</script>
<template>
  <Modal :includeCloseButton="true" :height="330" alignFooter="space-between">
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
        @click="{}"
      >
        <fa-icon :icon="['far', 'copy']" class="fill-primary" />
        <span class="ml-2">Copy</span>
      </button>
      <button
        class="flex items-center py-2 px-4 text-md text-red-400 hover:underline font-bold"
        @click="{}"
      >
        <fa-icon :icon="['fas', 'trash-can']" class="fill-primary" />
        <span class="ml-2">Delete</span>
      </button>
    </template>
  </Modal>
</template>
