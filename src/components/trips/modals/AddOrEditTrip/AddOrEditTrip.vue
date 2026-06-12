<script setup lang="ts">
import { Drawer } from "@/components/ui/drawer";
import useUIStateStore from "@/store/uiState.ts";
import { storeToRefs } from "pinia";
import useDrawerClose from "../../../ui/drawer/hooks/useDrawerClose.ts";
import AddOrEditTripContent from "./AddOrEditTripContent.vue";

const store = useUIStateStore();
const { isAddingOrEditingTrip, activeTripData } = storeToRefs(store);
const { onAnimationEnd, isContentOpen } = useDrawerClose(isAddingOrEditingTrip);
</script>
<template>
  <Drawer :open="isAddingOrEditingTrip" @animation-end="onAnimationEnd">
    <AddOrEditTripContent
      v-if="isContentOpen"
      :trip="activeTripData?.trip ?? null"
      :countries="activeTripData?.countries ?? null"
      :user-ids="activeTripData?.userIds ?? null"
    />
  </Drawer>
</template>
