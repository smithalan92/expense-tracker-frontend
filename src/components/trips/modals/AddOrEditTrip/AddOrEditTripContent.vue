<script setup lang="ts">
import type { User } from "@/api/app.ts";
import { FileUploadError } from "@/api/file.ts";
import { type CreateTripPayload, type Trip, type TripCountry } from "@/api/trip.ts";
import Badge from "@/components/ui/badge/Badge.vue";
import Button from "@/components/ui/button/Button.vue";
import { DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import Field from "@/components/ui/field/Field.vue";
import FieldGroup from "@/components/ui/field/FieldGroup.vue";
import FieldLabel from "@/components/ui/field/FieldLabel.vue";
import Input from "@/components/ui/input/Input.vue";
import Spinner from "@/components/ui/spinner/Spinner.vue";
import useAppStore from "@/store/appStore.ts";
import useTripDataStore from "@/store/tripDataStore.ts";
import useTripsStore from "@/store/tripsStore.ts";
import useUIStateStore from "@/store/uiState.ts";
import { PlusIcon, X, XCircle } from "@lucide/vue";
import { storeToRefs } from "pinia";
import { computed, ref, toRef } from "vue";
import { toast } from "vue-sonner";
import CoverImageUpload from "./CoverImageUpload.vue";
import useTripData, { type TripModalCountry } from "./hooks/useTripData";
import SelectCountryAndCities from "./SelectCountryAndCities.vue";

const { trip, countries, userIds } = defineProps<{
  trip: Nullable<Trip>;
  countries: Nullable<TripCountry[]>;
  userIds: Nullable<number[]>;
}>();

const isEditingTrip = computed(() => {
  return !!trip;
});

const { setIsAddingTrip, setTripToEdit } = useUIStateStore();

const appStore = useAppStore();
const { users, user: currentUser } = storeToRefs(appStore);

const { createTrip } = useTripsStore();
const { updateTrip } = useTripDataStore();

const { tripData, isDataValid } = useTripData({ trip, countries, userIds });

const selectedCountries = toRef(tripData.selectedCountries);
const selectedUsers = toRef(tripData.selectedUsers);

const isSelectCountryAndCitiesOpen = ref(false);
const isAddingOrUpdatingTrip = ref(false);

const onClose = () => {
  setIsAddingTrip(false);
  setTripToEdit(null);
};

const onSaveCountry = (country: TripModalCountry) => {
  const existingIndex = selectedCountries.value.findIndex((c) => c.id === country.id);

  if (existingIndex >= 0) {
    selectedCountries.value.splice(existingIndex, 1, country);
  } else {
    selectedCountries.value.push(country);
  }
};

const removeCity = (countryId: number, cityId: number) => {
  const countryIndex = selectedCountries.value.findIndex((c) => c.id === countryId);
  if (countryIndex < 0) return;

  const country = selectedCountries.value[countryIndex];
  const updatedCities = country.cities.filter((c) => c.id !== cityId);

  if (updatedCities.length === 0) {
    selectedCountries.value.splice(countryIndex, 1);
  } else {
    selectedCountries.value.splice(countryIndex, 1, { ...country, cities: updatedCities });
  }
};

const onSelectUser = (user: User) => {
  if (user.id === currentUser.value?.id) {
    toast.error("You can't remove yourself from a trip.");
    return;
  }

  const existingIdx = selectedUsers.value.findIndex((u) => u.id === user.id);

  if (existingIdx >= 0) {
    selectedUsers.value.splice(existingIdx, 1);
  } else {
    selectedUsers.value.push({ id: user.id, name: user.firstName });
  }
};

const onClickAddOrSaveTrip = async () => {
  isAddingOrUpdatingTrip.value = true;
  const payload: CreateTripPayload = {
    name: tripData.tripName,
    startDate: tripData.startDate,
    endDate: tripData.endDate,
    countries: tripData.selectedCountries.map((c) => ({
      countryId: c.id,
      cityIds: c.cities.map((ci) => ci.id),
    })),
    userIds: tripData.selectedUsers.map((u) => u.id),
  };

  try {
    if (isEditingTrip.value) {
      await updateTrip({ tripId: trip!.id, payload, file: tripData.selectedImage });
      toast.success("Trip updated.");
    } else {
      await createTrip(payload, tripData.selectedImage);
      toast.success("Trip created.");
    }

    onClose();
  } catch (err) {
    console.error(err);
    if (err instanceof FileUploadError) {
      toast.error(err.message);
    } else {
      toast.error(isEditingTrip.value ? "Failed to update trip." : "Failed to create trip.");
    }
  } finally {
    isAddingOrUpdatingTrip.value = false;
  }
};
</script>
<template>
  <DrawerContent :disable-outside-pointer-events="true">
    <div class="mx-auto w-full max-w-sm">
      <DrawerHeader class="flex-row items-center space-between flex-1">
        <DrawerTitle class="text-2xl flex-1">
          <span v-if="isEditingTrip">Edit Trip</span>
          <span v-else>Add Trip</span>
        </DrawerTitle>
        <Button variant="ghost" @click="onClose()">
          <XCircle class="size-6" />
        </Button>
      </DrawerHeader>
      <div class="flex flex-col px-4 mb-4 max-h-[500px] overflow-y-scroll">
        <Field class="min-w-0 flex-1">
          <FieldLabel>Name</FieldLabel>
          <Input type="text" v-model="tripData.tripName" class="text-xs" data-testid="trip-name-input" />
        </Field>
        <FieldGroup class="mt-4 flex-row gap-2">
          <Field class="min-w-0 flex-1">
            <FieldLabel>Start</FieldLabel>
            <Input
              type="date"
              v-model="tripData.startDate"
              class="text-xs"
              data-testid="trip-start-date-input"
            />
          </Field>
          <Field class="min-w-0 flex-1">
            <FieldLabel>End</FieldLabel>
            <Input type="date" v-model="tripData.endDate" class="text-xs" data-testid="trip-end-date-input" />
          </Field>
        </FieldGroup>
        <Field class="min-w-0 flex-1 mt-4">
          <FieldLabel>Cover Image</FieldLabel>
          <CoverImageUpload
            @update="(val) => (tripData.selectedImage = val)"
            :selected-image="tripData.selectedImage"
            :original-image="tripData.originalImage"
          />
        </Field>
        <Field class="min-w-0 flex-1 mt-4">
          <FieldLabel>Destinations</FieldLabel>
          <div class="">
            <div class="flex flex-col mb-2" v-for="country in selectedCountries" :key="country.id">
              <span class="text-muted-foreground font-bold text-sm font-mono">{{ country.name }}</span>
              <div class="flex flex-wrap gap-1 mt-2">
                <Button
                  v-for="city in country.cities"
                  :key="city.id"
                  variant="ghost"
                  class="p-0 m-0"
                  @click="removeCity(country.id, city.id)"
                >
                  <Badge class="text-white font-semibold">
                    {{ city.name }}
                    <X class="size-4" />
                  </Badge>
                </Button>
              </div>
            </div>
          </div>
          <Button variant="outline" @click="isSelectCountryAndCitiesOpen = true">
            <PlusIcon />
            <span class="text-xs">Add Destination</span>
          </Button>
        </Field>
        <Field class="min-w-0 flex-1 mt-4">
          <FieldLabel>Users</FieldLabel>
          <div class="flex flex-wrap gap-1 mt-2">
            <Button
              v-for="user in users"
              :key="user.id"
              variant="ghost"
              class="p-0 m-0"
              @click="onSelectUser(user)"
            >
              <Badge
                :variant="selectedUsers.findIndex((u) => u.id === user.id) >= 0 ? 'default' : 'outline'"
                class="text-white px-4 py-2"
              >
                {{ user.firstName }}
              </Badge>
            </Button>
          </div>
        </Field>
      </div>
      <DrawerFooter class="flex-1 pt-2 py-4">
        <Button
          variant="default"
          @click="onClickAddOrSaveTrip"
          :disabled="!isDataValid || isAddingOrUpdatingTrip"
        >
          <Spinner class="text-white" v-if="isAddingOrUpdatingTrip" />
          <span v-if="isEditingTrip">Save</span>
          <span v-else>Add</span>
        </Button>
      </DrawerFooter>
    </div>
  </DrawerContent>
  <SelectCountryAndCities
    :is-open="isSelectCountryAndCitiesOpen"
    :selected-countries="selectedCountries"
    @close="isSelectCountryAndCitiesOpen = false"
    @save="onSaveCountry"
  />
</template>
