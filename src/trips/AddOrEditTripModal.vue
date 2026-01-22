<script setup lang="ts">
import { type CreateTripCountry, type CreateTripPayload, type Trip } from "@/api/trip";
import Modal from "@/modal/Modal.vue";
import DatePicker from "@/pickers/DatePicker.vue";
import ImagePicker from "@/pickers/ImagePicker.vue";
import { type PickerOption } from "@/pickers/Picker.vue";
import useAppStore from "@/stores/appStore";
import useTripDataStore from "@/stores/tripDataStore";
import useTripsStore from "@/stores/tripsStore";
import Tooltip from "@/utils/Tooltip.vue";
import { useToast } from "@/utils/useToast";
import { useOnline } from "@vueuse/core";
import { addDays } from "date-fns";
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
const { createTrip } = useTripsStore();
const { trip, countries, userIds, updateTrip } = useTripDataStore();
const $toast = useToast();
const isOnline = useOnline();
const originalTrip = ref<Trip | null>(null);

const tripData = reactive<TripData>({
  selectedImage: null,
  tripName: "",
  startDate: format(new Date(), "yyyy-MM-dd"),
  endDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
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
    originalTrip.value = { ...trip };
    initalImage.value = trip.image;
    tripData.tripName = trip.name;
    tripData.startDate = format(new Date(trip.startDate), "yyyy-MM-dd");
    tripData.endDate = format(new Date(trip.endDate), "yyyy-MM-dd");
    tripData.selectedCountries = countries.map<TripModalCountry>((c) => {
      const data: TripModalCountry = {
        name: c.name,
        countryId: c.id,
        cityIds: c.cities.map((x) => x.id),
      };

      return data;
    });
    tripData.selectedUsers = userIds.map((id) => {
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

const toggleUser = (user: PickerOption) => {
  const index = tripData.selectedUsers.findIndex((u) => u.value === user.value);
  if (index >= 0) {
    tripData.selectedUsers.splice(index, 1);
  } else {
    tripData.selectedUsers.push(user);
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
    } else {
      await createTrip(payload, tripData.selectedImage);
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
  // Need to set a delay due to the modal opening animation
  setTimeout(() => nameInput.value?.focus(), 350);
});
</script>

<template>
  <Modal :title="modalTitle" :is-loading="isLoadingTripToEdit" @close="emit('close')" :height="'auto'">
    <template v-slot:body>
      <div class="et-expense-form">
        <!-- Trip Name -->
        <div class="et-expense-form__section">
          <label class="et-expense-form__section-title">Name</label>
          <input
            ref="name-input"
            class="et-input mt-2"
            placeholder="Trip to Fiji"
            v-model="tripData.tripName"
          />
        </div>

        <!-- Trip Image -->
        <div class="et-expense-form__section">
          <label class="et-expense-form__section-title">Image</label>
          <ImagePicker @change-image="(val) => (tripData.selectedImage = val)" :initalImage="initalImage" />
        </div>

        <!-- Dates -->
        <div class="et-expense-form__section">
          <label class="et-expense-form__section-title">When</label>
          <div class="et-expense-form__row">
            <div class="flex-1">
              <label class="et-expense-form__label">Start Date</label>
              <DatePicker v-model="tripData.startDate" />
            </div>
            <div class="flex-1">
              <label class="et-expense-form__label">End Date</label>
              <DatePicker v-model="tripData.endDate" />
            </div>
          </div>
        </div>

        <!-- Countries -->
        <div class="et-expense-form__section">
          <label class="et-expense-form__section-title">Countries</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="country in tripData.selectedCountries"
              :key="country.countryId"
              class="flex select-none items-center bg-sky-600/70 rounded-lg text-white transition-colors hover:bg-sky-600"
              @click="onClickSelectedCountry(country)"
            >
              <span class="px-3 py-2">{{ country.name }}</span>
              <span
                class="px-2 py-2 hover:opacity-60 cursor-pointer border-l border-white/20"
                @click.stop="onClickDeleteCountry(country.countryId)"
              >
                <fa-icon :icon="['fas', 'xmark']" />
              </span>
            </button>
          </div>
          <button
            ref="add-country-button"
            class="mt-3 px-4 py-2.5 bg-transparent border-2 border-slate-400/40 text-slate-300 rounded-lg flex items-center hover:border-slate-400/60 hover:bg-slate-700/20 transition-all"
            @click="isAddCountryModalOpen = true"
          >
            <fa-icon :icon="['fas', 'plus']" class="mr-2 text-sm" />
            <span>Add Country</span>
          </button>
        </div>

        <!-- Users -->
        <div class="et-expense-form__section">
          <label class="et-expense-form__section-title">Travelers</label>
          <div class="et-expense-form__user-chips">
            <button
              v-for="user in userOptions"
              :key="user.value"
              class="et-expense-form__user-chip"
              :class="{
                'et-expense-form__user-chip--selected': tripData.selectedUsers.some(
                  (u) => u.value === user.value,
                ),
              }"
              @click="toggleUser(user)"
            >
              {{ user.label.split(" ")[0] }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <Tooltip
        :message="tooltipOfflineMessage"
        :forceOpenOnMobile="true"
        :disabled="isOnline"
        placement="top"
        class="flex-1"
      >
        <button
          class="et-btn-primary w-full"
          :disabled="!canSaveTrip || isCreatingTrip || !isOnline"
          @click="onSaveTrip"
        >
          <fa-icon v-if="!tripIdToEdit" :icon="['fas', 'plus']" />
          <fa-icon v-if="tripIdToEdit && !isCreatingTrip" :icon="['fas', 'check']" />
          <fa-icon v-if="isCreatingTrip" :icon="['fas', 'circle-notch']" class="animate-spin" />
          <span v-if="!tripIdToEdit && !isCreatingTrip">Create Trip</span>
          <span v-if="tripIdToEdit && !isCreatingTrip">Save Changes</span>
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
