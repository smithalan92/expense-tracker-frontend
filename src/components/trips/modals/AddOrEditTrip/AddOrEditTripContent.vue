<script setup lang="ts">
import type { Trip } from "@/api/trip.ts";
import Button from "@/components/ui/button/Button.vue";
import { DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import Field from "@/components/ui/field/Field.vue";
import FieldGroup from "@/components/ui/field/FieldGroup.vue";
import FieldLabel from "@/components/ui/field/FieldLabel.vue";
import Input from "@/components/ui/input/Input.vue";
import useUIStateStore from "@/store/uiState.ts";
import { XCircle } from "@lucide/vue";
import { computed } from "vue";
import CoverImageUpload from "./CoverImageUpload.vue";
import useTripData from "./hooks/useTripData";

const { trip } = defineProps<{ trip: Trip | null }>();

const isEditingTrip = computed(() => {
  return !!trip;
});

const { setIsAddingOrEditingTrip } = useUIStateStore();

const { tripData } = useTripData(trip);
</script>
<template>
  <DrawerContent :disable-outside-pointer-events="true">
    <div class="mx-auto w-full max-w-sm">
      <DrawerHeader class="flex-row items-center space-between flex-1">
        <DrawerTitle class="text-2xl flex-1">
          <span v-if="isEditingTrip">Edit Trip</span>
          <span v-else>Add Trip</span>
        </DrawerTitle>
        <Button variant="ghost" @click="setIsAddingOrEditingTrip(false)">
          <XCircle class="size-6" />
        </Button>
      </DrawerHeader>
      <div class="flex flex-col px-4 mb-4">
        <Field class="min-w-0 flex-1">
          <FieldLabel>When</FieldLabel>
          <Input type="text" v-model="tripData.tripName" class="text-xs" />
        </Field>
        <FieldGroup class="mt-4 flex-row gap-2">
          <Field class="min-w-0 flex-1">
            <FieldLabel>Start</FieldLabel>
            <Input type="date" v-model="tripData.startDate" class="text-xs" />
          </Field>
          <Field class="min-w-0 flex-1">
            <FieldLabel>End</FieldLabel>
            <Input type="date" v-model="tripData.endDate" class="text-xs" />
          </Field>
        </FieldGroup>
        <Field class="min-w-0 flex-1 mt-4">
          <FieldLabel>Cover Image</FieldLabel>
          <CoverImageUpload
            @update="(val) => (tripData.selectedImage = val)"
            :selected-image="tripData.selectedImage"
          />
        </Field>
      </div>
      <DrawerFooter class="flex-1 pt-2 py-4">
        <Button variant="default" @click="() => {}">
          <span v-if="isEditingTrip">Save</span>
          <span v-else>Add</span>
        </Button>
      </DrawerFooter>
    </div>
  </DrawerContent>
</template>
