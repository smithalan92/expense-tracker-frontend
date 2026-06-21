<script setup lang="ts">
import type { Trip } from "@/api/trip.ts";
import { Drawer } from "@/components/ui/drawer";
import { ref, watch } from "vue";
import useDrawerClose from "../../../ui/drawer/hooks/useDrawerClose.ts";
import TripInfoModalContent from "./TripInfoModalContent.vue";

const { trip, isOpen } = defineProps<{ trip: Nullable<Trip>; isOpen: boolean }>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const isViewingTrip = ref(false);

watch(
  () => isOpen,
  (newVal) => (isViewingTrip.value = newVal),
);

const { onAnimationEnd, isContentOpen } = useDrawerClose(isViewingTrip);
</script>
<template>
  <Drawer :open="isViewingTrip" @animation-end="onAnimationEnd">
    <TripInfoModalContent v-if="isContentOpen && trip" :trip="trip" @close="emit('close')" />
  </Drawer>
</template>
