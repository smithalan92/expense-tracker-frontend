<script setup lang="ts">
import Modal from "@/modal/Modal.vue";
import Picker from "@/pickers/Picker.vue";
import { computed, ref } from "vue";
import type { TripModalCountry } from "./AddTripModal.vue";
import CityPickerList from "./CityPickerList.vue";
import useAddCountryModalOptions from "./hooks/useAddCountryModalOptions";

const { countrySelectionToEdit } = defineProps<{
  countrySelectionToEdit?: Nullable<TripModalCountry>;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", country: TripModalCountry): void;
}>();

const { countryOptions } = useAddCountryModalOptions();

const selectedCountryId = ref<Nullable<number>>(countrySelectionToEdit?.countryId ?? null);
const selectedCityIds = ref<number[]>(countrySelectionToEdit?.cityIds ?? []);

const selectedCountry = computed(() =>
  countryOptions.value.find((c) => c.value === selectedCountryId.value),
);

const onClickSave = () => {
  if (!selectedCountry.value) return;

  const data: TripModalCountry = {
    name: selectedCountry.value.label,
    countryId: selectedCountry.value.value,
    cityIds: selectedCityIds.value,
  };

  emit("save", data);
  emit("close");
};
</script>

<template>
  <Modal title="Add a Country">
    <template v-slot:body>
      <div class="flex flex-col py-4">
        <span class="mb-4 font-bold">Pick a country</span>
        <Picker :options="countryOptions" v-model="selectedCountryId" />
      </div>
      <div v-if="selectedCountryId" class="flex flex-col py-4">
        <CityPickerList :countryId="selectedCountryId" v-model="selectedCityIds" />
      </div>
    </template>

    <template v-slot:footer>
      <button class="btn btn-secondary font-bold text-md mr-4" @click="emit('close')">
        Cancel
      </button>
      <button
        class="btn btn-primary font-bold text-md"
        :disabled="!selectedCountry"
        @click="onClickSave"
      >
        Save
      </button>
    </template>
  </Modal>
</template>
