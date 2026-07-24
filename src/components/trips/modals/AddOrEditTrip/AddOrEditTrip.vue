<script setup lang="ts">
import { Drawer, useDrawerClose } from "@/components/ui/drawer";
import useUIStateStore from "@/store/uiState.ts";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import AddOrEditTripContent from "./AddOrEditTripContent.vue";

const store = useUIStateStore();
const { isAddingTrip, tripToEdit } = storeToRefs(store);

const source = computed(() => {
  if (!isAddingTrip.value && !tripToEdit.value) return null;

  return {
    trip: tripToEdit.value?.trip ?? null,
    countries: tripToEdit.value?.countries ?? null,
    userIds: tripToEdit.value?.userIds ?? null,
  };
});

const { isOpen, content, key, onOpenComplete } = useDrawerClose(source);
</script>
<template>
  <Drawer :open="isOpen" @update:open-complete="onOpenComplete">
    <AddOrEditTripContent
      v-if="content"
      :key="key"
      :trip="content.trip"
      :countries="content.countries"
      :user-ids="content.userIds"
    />
  </Drawer>
</template>
