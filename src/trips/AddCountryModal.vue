<script setup lang="ts">
import Modal from "@/modal/Modal.vue";
import Picker, { type PickerOption } from "@/pickers/Picker.vue";
import { ref, watch } from "vue";
import type { TripModalCountry } from "./AddOrEditTripModal.vue";
import CityPickerList from "./CityPickerList.vue";
import useAddCountryModalOptions from "./hooks/useAddCountryModalOptions";

const props = defineProps<{
  countrySelectionToEdit?: Nullable<TripModalCountry>;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", country: TripModalCountry): void;
}>();

const { countryOptions } = useAddCountryModalOptions();

const selectedCountry = ref<Nullable<PickerOption>>(null);
const selectedCityIds = ref<number[]>([]);

watch(
  () => props.countrySelectionToEdit,
  () => {
    if (props.countrySelectionToEdit) {
      selectedCountry.value = {
        label: props.countrySelectionToEdit.name,
        value: props.countrySelectionToEdit.countryId,
      };
      selectedCityIds.value = props.countrySelectionToEdit.cityIds ?? [];
    }
  },
  {
    immediate: true,
  },
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
        {{ countrySelectionToEdit?.name }}
        <span class="mb-4 font-bold">Pick a country</span>
        <Picker :options="countryOptions" v-model="selectedCountry" />
      </div>
      <div v-if="selectedCountry" class="flex flex-col py-4">
        <CityPickerList :countryId="selectedCountry.value" v-model="selectedCityIds" />
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
