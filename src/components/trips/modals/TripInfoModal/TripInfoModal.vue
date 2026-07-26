<script setup lang="ts">
import type { Trip } from "@/api/trip.ts";
import { Drawer, useDrawerClose } from "@/components/ui/drawer";
import { computed } from "vue";
import TripInfoModalContent from "./TripInfoModalContent.vue";

const { trip, isOpen: isOpenProp } = defineProps<{ trip: Nullable<Trip>; isOpen: boolean }>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const source = computed(() => (isOpenProp && trip ? trip : null));

const { isOpen, content: activeTrip, key, onOpenComplete } = useDrawerClose(source);
</script>
<template>
  <Drawer :open="isOpen" @update:open-complete="onOpenComplete">
    <TripInfoModalContent v-if="activeTrip" :key="key" :trip="activeTrip" @close="emit('close')" />
  </Drawer>
</template>
