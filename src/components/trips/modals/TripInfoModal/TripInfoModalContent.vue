<script setup lang="ts">
import type { Trip } from "@/api/trip";
import Button from "@/components/ui/button/Button.vue";
import Dialog from "@/components/ui/dialog/Dialog.vue";
import DialogContent from "@/components/ui/dialog/DialogContent.vue";
import DialogFooter from "@/components/ui/dialog/DialogFooter.vue";
import DialogHeader from "@/components/ui/dialog/DialogHeader.vue";
import DialogTitle from "@/components/ui/dialog/DialogTitle.vue";
import { DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import Separator from "@/components/ui/separator/Separator.vue";
import Spinner from "@/components/ui/spinner/Spinner.vue";
import router from "@/router";
import useTripsStore from "@/store/tripsStore";
import { Calendar, Copy, MapPin, Trash, XCircle } from "@lucide/vue";
import { format } from "date-fns";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";

const { trip } = defineProps<{ trip: Trip }>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const startDate = computed(() => format(new Date(trip.startDate), "do MMM yyyy"));
const endDate = computed(() => format(new Date(trip.endDate), "do MMM yyyy"));

const countryList = computed(() => {
  const names = trip.countries.map((c) => c.name);
  if (names.length <= 1) return names[0] ?? "";
  return names.slice(0, -1).join(", ") + " and " + names.at(-1);
});

const onClickView = () => {
  emit("close");
  router.push({ name: "tripData", params: { tripId: trip.id } });
};

const isConfirmDeleteModalOpen = ref(false);
const isDeletingTrip = ref(false);
const { deleteTrip } = useTripsStore();

const onClickDelete = () => {
  isConfirmDeleteModalOpen.value = true;
};

const onConfirmDelete = async () => {
  isDeletingTrip.value = true;
  try {
    await deleteTrip(trip.id);
    toast.success("Trip deleted.");
    emit("close");
  } catch (err) {
    console.log(err);
    toast.error("Failed to delete trip.");
  } finally {
    isDeletingTrip.value = false;
  }
};
</script>
<template>
  <DrawerContent :disable-outside-pointer-events="true">
    <div class="mx-auto w-full max-w-sm">
      <DrawerHeader class="flex-row items-center space-between flex-1">
        <DrawerTitle class="flex-1 text-2xl">{{ trip.name }}</DrawerTitle>
        <Button variant="ghost" @click="emit('close')">
          <XCircle class="size-6" />
        </Button>
      </DrawerHeader>
      <div class="flex flex-col text-muted-foreground text-sm px-4 mb-4">
        <div class="flex items-center gap-2 mt-2">
          <div class="flex items-center">
            <MapPin class="mr-1 size-[12px]" />
            <span>{{ countryList }}</span>
          </div>
          <div class="h-4">
            <Separator orientation="vertical" />
          </div>
        </div>
        <div class="flex mt-2 items-center">
          <Calendar class="mr-1 size-[12px]" />
          <span>{{ startDate }} to {{ endDate }}</span>
        </div>
      </div>
      <DrawerFooter class="flex-1">
        <Button variant="secondary" @click="onClickView">
          <Copy class="mr-1 size-[12px]" />
          View
        </Button>
        <Button class="mt-4" variant="destructive" @click="onClickDelete">
          <Trash class="mr-1 size-[12px]" />
          Delete
        </Button>
      </DrawerFooter>
    </div>
  </DrawerContent>
  <Dialog v-model:open="isConfirmDeleteModalOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Confirm Delete</DialogTitle>
      </DialogHeader>
      <div class="flex items-center gap-2">
        <div class="text-center py-4">Are you sure you want to delete "{{ trip.name }}" ?</div>
      </div>
      <DialogFooter>
        <Button variant="secondary" @click="isConfirmDeleteModalOpen = false">Cancel</Button>
        <Button variant="destructive" @click="onConfirmDelete">
          <Spinner class="text-white" v-if="isDeletingTrip" />
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
