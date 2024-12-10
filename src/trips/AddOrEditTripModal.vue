<script setup lang="ts">
import {
  createTrip,
  getTripForEditing,
  updateTrip,
  uploadFile,
  type CreateTripCountry,
  type CreateTripPayload,
} from "@/api";
import Modal from "@/modal/Modal.vue";
import DatePicker from "@/pickers/DatePicker.vue";
import ImagePicker from "@/pickers/ImagePicker.vue";
import Picker, { type PickerOption } from "@/pickers/Picker.vue";
import useAppStore from "@/stores/appStore";
import useTripDataStore from "@/stores/tripDataStore";
import useTripsStore from "@/stores/tripsStore";
import { useToast } from "@/utils/useToast";
import { addDays } from "date-fns";
import { format } from "date-fns/format";
import { computed, nextTick, onBeforeMount, onMounted, ref, useTemplateRef } from "vue";
import AddCountryModal from "./AddCountryModal.vue";

export interface TripModalCountry extends CreateTripCountry {
  name: string;
}

const { tripIdToEdit } = defineProps<{
  tripIdToEdit?: number;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { user, users } = useAppStore();
const { loadTrips } = useTripsStore();
const { loadTrip } = useTripDataStore();
const $toast = useToast();

const selectedImage = ref<Nullable<File>>(null);
const initalImage = ref<Nullable<string>>(null);
const tripName = ref("");
const startDate = ref(format(new Date(), "yyyy-MM-dd"));
const endDate = ref(format(addDays(new Date(), 1), "yyyy-MM-dd"));
const selectedCountries = ref<TripModalCountry[]>([]);
const selectedCountryToEdit = ref<Nullable<TripModalCountry>>(null);
const isAddCountryModalOpen = ref(false);
const isLoadingTripToEdit = ref(false);

const userOptions = computed<PickerOption[]>(() => {
  return users.map((u) => ({
    label: `${u.firstName} ${u.lastName}`,
    value: u.id,
  }));
});

const selectedUsers = ref<PickerOption[]>([userOptions.value.find((u) => u.value === user!.id)!]);

onBeforeMount(async () => {
  if (tripIdToEdit) {
    try {
      isLoadingTripToEdit.value = true;
      const trip = await getTripForEditing(tripIdToEdit);
      initalImage.value = trip.image;
      tripName.value = trip.name;
      startDate.value = format(new Date(trip.startDate), "yyyy-MM-dd");
      endDate.value = format(new Date(trip.endDate), "yyyy-MM-dd");
      selectedCountries.value = trip.countries.map((c) => {
        if (!c.cityIds) c.cityIds = [];
        return c;
      });
      selectedUsers.value = trip.userIds.map((id) => {
        return userOptions.value.find((u) => u.value === id)!;
      });
    } catch (error) {
      console.error(error);
      $toast.error("Failed to load trip data for editing.");
      emit("close");
    } finally {
      isLoadingTripToEdit.value = false;
    }
  }
});

const isCreatingTrip = ref(false);

const canSaveTrip = computed(() => {
  return (
    tripName.value.trim().length > 0 &&
    startDate.value &&
    endDate.value &&
    selectedCountries.value.length > 0 &&
    selectedUsers.value.length > 0
  );
});

const nameInput = useTemplateRef("name-input");
const addCountryButton = useTemplateRef("add-country-button");

const onClickSelectedCountry = async (country: TripModalCountry) => {
  selectedCountryToEdit.value = country;
  await nextTick();
  isAddCountryModalOpen.value = true;
};

const onCloseAddCountryModal = () => {
  isAddCountryModalOpen.value = false;
  selectedCountryToEdit.value = null;
};

const onClickDeleteCountry = (countryId: number) => {
  selectedCountries.value = selectedCountries.value.filter((c) => c.countryId !== countryId);
};

const onSaveCountry = async (country: TripModalCountry) => {
  const existingSelectedCountryIdx = selectedCountries.value.findIndex(
    (c) => c.countryId === country.countryId,
  );

  if (existingSelectedCountryIdx > -1) {
    selectedCountries.value.splice(existingSelectedCountryIdx, 1, country);
  } else {
    selectedCountries.value.push(country);
  }

  if (addCountryButton.value) {
    await nextTick();
    addCountryButton.value.scrollIntoView();
  }
};

const onSaveTrip = async () => {
  isCreatingTrip.value = true;
  const payload: CreateTripPayload = {
    name: tripName.value,
    startDate: startDate.value,
    endDate: endDate.value,
    countries: selectedCountries.value,
    userIds: selectedUsers.value.map((u) => u.value),
  };

  try {
    if (selectedImage.value) {
      const file = await uploadFile(selectedImage.value);
      payload.file = file;
    }
  } catch (err) {
    console.error(err);
    $toast.error("Failed to upload image for trip.");
    return;
  }
  try {
    if (tripIdToEdit) {
      await updateTrip(tripIdToEdit, payload);
      loadTrip(tripIdToEdit);
    } else {
      await createTrip(payload);
      loadTrips();
    }

    emit("close");
  } catch (err) {
    console.error(err);
    $toast.error("Failed to create trip.");
  } finally {
    isCreatingTrip.value = false;
  }
};

onMounted(() => {
  nameInput.value?.focus();
});
</script>

<template>
  <Modal title="Add Trip" :is-loading="isLoadingTripToEdit" @close="emit('close')">
    <template v-slot:body>
      <div class="grid grid-cols-4 gap-1 py-4">
        <span class="col-span-1 content-center">Image</span>
        <ImagePicker
          class="col-span-3"
          @change-image="(val) => (selectedImage = val)"
          :initalImage="initalImage"
        />
      </div>

      <div class="grid grid-cols-4 gap-1 py-4">
        <span class="col-span-1 content-center">Name</span>
        <input
          ref="name-input"
          class="col-span-3 input input-md input-bordered rounded-md bg-white text-black"
          placeholder="Trip to Fiji"
          v-model="tripName"
        />
      </div>

      <div class="grid grid-cols-4 gap-1 py-4">
        <span class="col-span-1 content-center">Start Date</span>
        <DatePicker class="col-span-3" v-model="startDate" />
      </div>

      <div class="grid grid-cols-4 gap-1 py-4">
        <span class="col-span-1 content-center">End Date</span>
        <DatePicker class="col-span-3" v-model="endDate" />
      </div>

      <div class="grid grid-cols-4 gap-1 py-4">
        <span class="col-span-1 content-center">Countries</span>
        <div class="col-span-3">
          <div
            v-for="country in selectedCountries"
            :key="country.countryId"
            class="flex select-none items-center bg-blue-400 rounded text-white mr-2 mt-1"
          >
            <button class="p-2 flex-1" @click="onClickSelectedCountry(country)">
              {{ country.name }}
            </button>
            <button
              class="p-2 hover:opacity-60 cursor-pointer"
              @click="onClickDeleteCountry(country.countryId)"
            >
              <fa-icon :icon="['fas', 'xmark']" class="ml-2" />
            </button>
          </div>
          <div>
            <button
              ref="add-country-button"
              class="mt-2 p-1 bg-slate-500 text-white rounded flex items-center hover:bg-slate-400"
              @click="isAddCountryModalOpen = true"
            >
              <fa-icon :icon="['fas', 'plus']" class="ml-1 mr-2" />
              <span>Add Country</span>
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-4 gap-1 py-4">
        <span class="col-span-1 content-center">Users</span>
        <Picker
          class="col-span-3 z-50"
          v-model="selectedUsers"
          :options="userOptions"
          :is-multi="true"
        />
      </div>
    </template>

    <template v-slot:footer>
      <button
        class="btn btn-secondary font-bold text-md mr-4"
        :disabled="isCreatingTrip"
        @click="emit('close')"
      >
        Cancel
      </button>

      <button
        class="btn btn-primary font-bold text-md"
        :disabled="!canSaveTrip || isCreatingTrip"
        @click="onSaveTrip"
      >
        <span v-if="!isCreatingTrip">Save</span>
        <fa-icon v-if="isCreatingTrip" :icon="['fas', 'circle-notch']" class="animate-spin" />
      </button>
    </template>
  </Modal>

  <AddCountryModal
    v-if="isAddCountryModalOpen"
    :countrySelectionToEdit="selectedCountryToEdit"
    @save="onSaveCountry"
    @close="onCloseAddCountryModal"
  />
</template>
