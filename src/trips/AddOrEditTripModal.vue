<script setup lang="ts">
import {
  getTripForEditing,
  type CreateTripCountry,
  type CreateTripPayload,
  type GetTripEditDataResponse,
} from "@/api/trip";
import Modal from "@/modal/Modal.vue";
import DatePicker from "@/pickers/DatePicker.vue";
import ImagePicker from "@/pickers/ImagePicker.vue";
import Picker, { type PickerOption } from "@/pickers/Picker.vue";
import useAppStore from "@/stores/appStore";
import useTripDataStore from "@/stores/tripDataStore";
import useTripsStore from "@/stores/tripsStore";
import Tooltip from "@/utils/Tooltip.vue";
import { useToast } from "@/utils/useToast";
import { useOnline } from "@vueuse/core";
import { format } from "date-fns/format";
import { computed, nextTick, onBeforeMount, onMounted, reactive, ref, useTemplateRef } from "vue";
import AddCountryModal from "./AddCountryModal.vue";

const { tripIdToEdit } = defineProps<{
  tripIdToEdit?: number;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { user, users } = useAppStore();
const { loadTrips, createTrip } = useTripsStore();
const { updateTrip } = useTripDataStore();
const $toast = useToast();
const isOnline = useOnline();
const originalTrip = ref<GetTripEditDataResponse | null>(null);

const tripData = reactive<TripData>({
  selectedImage: null,
  tripName: "",
  startDate: "",
  endDate: "",
  selectedCountries: [],
  selectedUsers: [],
});

const initalImage = ref<Nullable<string>>(null);
const selectedCountryToEdit = ref<Nullable<TripModalCountry>>(null);
const isAddCountryModalOpen = ref(false);
const isLoadingTripToEdit = ref(false);

const modalTitle = computed(() => {
  if (tripIdToEdit) return `Edit ${originalTrip.value?.name ?? "trip"}`;
  return "Add trip";
});

const userOptions = computed<PickerOption[]>(() => {
  return users.map((u) => ({
    label: `${u.firstName} ${u.lastName}`,
    value: u.id,
  }));
});

onBeforeMount(async () => {
  if (!tripIdToEdit) {
    tripData.selectedUsers = [userOptions.value.find((u) => u.value === user?.id)!];
    return;
  }

  try {
    isLoadingTripToEdit.value = true;
    const trip = await getTripForEditing(tripIdToEdit);
    originalTrip.value = trip;
    initalImage.value = trip.image;
    tripData.tripName = trip.name;
    tripData.startDate = format(new Date(trip.startDate), "yyyy-MM-dd");
    tripData.endDate = format(new Date(trip.endDate), "yyyy-MM-dd");
    tripData.selectedCountries = trip.countries.map((c) => {
      if (!c.cityIds) c.cityIds = [];
      return c;
    });
    tripData.selectedUsers = trip.userIds.map((id) => {
      return userOptions.value.find((u) => u.value === id)!;
    });
  } catch (error) {
    console.error(error);
    $toast.error("Failed to load trip data for editing.");
    emit("close");
  } finally {
    isLoadingTripToEdit.value = false;
  }
});

const isCreatingTrip = ref(false);

const canSaveTrip = computed(() => {
  return (
    tripData.tripName.trim().length > 0 &&
    !!tripData.startDate &&
    !!tripData.endDate &&
    tripData.selectedCountries.length > 0 &&
    tripData.selectedUsers.length > 0
  );
});

const nameInput = useTemplateRef("name-input");
const addCountryButton = useTemplateRef("add-country-button");

const tooltipOfflineMessage = computed(() => {
  if (tripIdToEdit) return "Trip editing is disabled when your offline.";
  return "You can't add a trip when your offline";
});

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
  tripData.selectedCountries = tripData.selectedCountries.filter((c) => c.countryId !== countryId);
};

const onSaveCountry = async (country: TripModalCountry) => {
  const existingSelectedCountryIdx = tripData.selectedCountries.findIndex(
    (c) => c.countryId === country.countryId,
  );

  if (existingSelectedCountryIdx > -1) {
    tripData.selectedCountries.splice(existingSelectedCountryIdx, 1, country);
  } else {
    tripData.selectedCountries.push(country);
  }

  if (addCountryButton.value) {
    await nextTick();
    addCountryButton.value.scrollIntoView();
  }
};

const onSaveTrip = async () => {
  isCreatingTrip.value = true;
  const payload: CreateTripPayload = {
    name: tripData.tripName,
    startDate: tripData.startDate,
    endDate: tripData.endDate,
    countries: tripData.selectedCountries,
    userIds: tripData.selectedUsers.map((u) => u.value),
  };

  try {
    if (tripIdToEdit) {
      await updateTrip({ tripId: tripIdToEdit, payload, file: tripData.selectedImage });
      loadTrips();
    } else {
      createTrip(payload, tripData.selectedImage);
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
  <Modal :title="modalTitle" :is-loading="isLoadingTripToEdit" @close="emit('close')">
    <template v-slot:body>
      <div class="grid grid-cols-4 gap-1 py-4">
        <span class="col-span-1 content-center">Image</span>
        <ImagePicker
          class="col-span-3"
          @change-image="(val) => (tripData.selectedImage = val)"
          :initalImage="initalImage"
        />
      </div>

      <div class="grid grid-cols-4 gap-1 py-4">
        <span class="col-span-1 content-center">Name</span>
        <input
          ref="name-input"
          class="col-span-3 input input-md input-bordered rounded-md bg-white text-black"
          placeholder="Trip to Fiji"
          v-model="tripData.tripName"
        />
      </div>

      <div class="grid grid-cols-4 gap-1 py-4">
        <span class="col-span-1 content-center">Start Date</span>
        <DatePicker class="col-span-3" v-model="tripData.startDate" />
      </div>

      <div class="grid grid-cols-4 gap-1 py-4">
        <span class="col-span-1 content-center">End Date</span>
        <DatePicker class="col-span-3" v-model="tripData.endDate" />
      </div>

      <div class="grid grid-cols-4 gap-1 py-4">
        <span class="col-span-1 content-center">Countries</span>
        <div class="col-span-3">
          <div
            v-for="country in tripData.selectedCountries"
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
          v-model="tripData.selectedUsers"
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

      <Tooltip :message="tooltipOfflineMessage" :force-open-on-mobile="true" :disabled="isOnline">
        <button
          class="btn btn-primary font-bold text-md"
          :disabled="!canSaveTrip || isCreatingTrip || !isOnline"
          @click="onSaveTrip"
        >
          <span v-if="!isCreatingTrip">Save</span>
          <fa-icon v-if="isCreatingTrip" :icon="['fas', 'circle-notch']" class="animate-spin" />
        </button>
      </Tooltip>
    </template>
  </Modal>

  <AddCountryModal
    v-if="isAddCountryModalOpen"
    :countrySelectionToEdit="selectedCountryToEdit"
    @save="onSaveCountry"
    @close="onCloseAddCountryModal"
  />
</template>

<script lang="ts">
export interface TripModalCountry extends CreateTripCountry {
  name: string;
}

interface TripData {
  selectedImage: Nullable<File>;
  tripName: string;
  startDate: string;
  endDate: string;
  selectedCountries: TripModalCountry[];
  selectedUsers: PickerOption[];
}
</script>
