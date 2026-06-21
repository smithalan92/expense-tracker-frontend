<script setup lang="ts">
import type { Trip } from "@/api/trip";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Flag from "@/components/ui/flag/Flag.vue";
import { formatDateRange, getTripCoverStyle } from "@/utils/ui";
import { differenceInCalendarDays, differenceInCalendarWeeks } from "date-fns";
import { isAfter } from "date-fns/isAfter";
import { isBefore } from "date-fns/isBefore";
import { computed } from "vue";
import { useRouter } from "vue-router";
import Button from "../ui/button/Button.vue";

const { trip } = defineProps<{
  trip: Trip;
}>();

const router = useRouter();

const tripStatus = computed(() => {
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const today = new Date();

  if (isBefore(endDate, today)) {
    return "Finished";
  }

  if (isAfter(startDate, today)) {
    const daysAway = differenceInCalendarDays(startDate, today);

    if (daysAway > 31) {
      const weeksAway = differenceInCalendarWeeks(startDate, today);
      return `${weeksAway} weeks`;
    }

    return `${daysAway} ${daysAway === 1 ? "day" : "days"}`;
  }

  return "In progress";
});

const emit = defineEmits<{
  longPress: [trip: Trip];
}>();

let pressTimer: ReturnType<typeof setTimeout> | null = null;
let didLongPress = false;

const onPointerDown = () => {
  didLongPress = false;
  pressTimer = setTimeout(() => {
    didLongPress = true;
    emit("longPress", trip);
  }, 500);
};

const onPointerUp = () => {
  if (pressTimer) {
    clearTimeout(pressTimer);
    pressTimer = null;
  }
};

const onClick = () => {
  if (didLongPress) return;
  router.push({ name: "tripData", params: { tripId: trip.id } });
};
</script>
<template>
  <Button
    variant="ghost"
    class="h-auto w-full p-0 text-left cursor-pointer"
    @click="onClick"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointerleave="onPointerUp"
  >
    <Card
      class="border-none flex flex-col justify-between p-4 w-full h-[220px]"
      :style="getTripCoverStyle(trip.image)"
    >
      <!-- Status + avatars -->
      <div class="flex justify-between items-start">
        <Badge
          variant="outline"
          class="rounded-full text-xs font-semibold px-3 py-1.5 border-white/[0.2] bg-black/50 text-white/95"
        >
          {{ tripStatus }}
        </Badge>
        <div class="flex">
          <div
            class="overflow-hidden rounded-full -ml-2.5 first:ml-0 border border-solid border-white"
            v-for="country in trip.countries"
            :key="country.code"
          >
            <Flag :code="country.code" class="size-[30px] rounded-[50%]" />
          </div>
        </div>
      </div>

      <!-- name / meta -->
      <div>
        <div
          class="h-title text-md"
          style="color: oklch(0.99 0.01 85); text-shadow: 0 1px 12px oklch(0 0 0 / 0.35)"
        >
          {{ trip.name }}
        </div>
        <div class="flex items-end justify-between gap-2.5">
          <span class="text-[13.5px] font-semibold" style="color: oklch(0.95 0.02 80 / 0.92)">
            {{ formatDateRange(trip.startDate, trip.endDate) }}
          </span>
          <div class="text-right">
            <div
              class="mono font-semibold tracking-[-0.5px] text-lg"
              style="color: oklch(0.99 0.01 85); text-shadow: 0 1px 12px oklch(0 0 0 / 0.4)"
            >
              €{{ Intl.NumberFormat().format(trip.totalExpenseAmount) }}
            </div>
            <div class="mono text-[11px]" style="color: oklch(0.95 0.02 80 / 0.7)">
              {{ trip.expenseCount > 0 ? `${trip.expenseCount} expenses` : "nothing logged yet" }}
            </div>
          </div>
        </div>
      </div>
    </Card>
  </Button>
</template>
