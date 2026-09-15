<script lang="ts" setup>
import { getTripData } from "@/api/trip.ts";
import { Drawer, useDrawerClose } from "@/components/ui/drawer";
import useUIStateStore from "@/store/uiState.ts";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import AddOrEditTripContent from "./AddOrEditTripContent.vue";

const store = useUIStateStore();
const { tripIdToEdit } = storeToRefs(store);

const data = tripIdToEdit.value ? await getTripData(tripIdToEdit.value) : null;

const source = computed(() => {
  if (!tripIdToEdit.value || !data) return null;

  return {
    trip: data.trip,
    countries: data.countries,
    userIds: data.userIds,
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
