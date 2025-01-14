<script setup lang="ts">
import Modal from "@/modal/Modal.vue";
import { computed, ref, toRefs, watch } from "vue";
import City from "./City.vue";
import useCityOptions from "./hooks/useCityOptions";

const props = defineProps<{
  countryId: number;
}>();

const { countryId } = toRefs(props);

const selectedCityIds = defineModel<number[]>({ default: [] });

const searchTerm = ref("");
const isViewSelectedCitiesModalOpen = ref(false);

const { cityOptions, filteredCityOptions } = useCityOptions(countryId, searchTerm);

const selectedCities = computed(() => {
  return selectedCityIds.value.map((id) => cityOptions.value.find((option) => option.value === id)!);
});

watch(
  () => selectedCityIds,
  (newVal) => {
    console.log(newVal);
  },
);

watch(selectedCities, (newVal) => {
  console.log(newVal);
});

const onClickCity = (cityId: number) => {
  const existingItemIdx = selectedCityIds.value.indexOf(cityId);
  if (existingItemIdx > -1) {
    selectedCityIds.value.splice(existingItemIdx, 1);
  } else {
    selectedCityIds.value.push(cityId);
  }
};

const toggleViewSelectedCitiesModal = () => {
  isViewSelectedCitiesModalOpen.value = !isViewSelectedCitiesModalOpen.value;
};
</script>

<template>
  <div class="flex flex-col">
    <span class="mb-2 font-bold">Pick the cities you will visit</span>
    <span class="mb-2 text-sm">
      If you dont select any you will be able to choose any of them when adding an expense.
    </span>
    <div class="my-2">
      <input
        type="search"
        class="w-full p-2 rounded bg-white border border-solid border-gray-200"
        placeholder="Search for a city"
        v-model="searchTerm"
      />
    </div>
    <div class="mt-4 flex justify-between flex-wrap max-h-[150px] overflow-scroll pr-4">
      <span v-if="!filteredCityOptions.length && searchTerm">No cities match your search term</span>

      <div v-if="filteredCityOptions.length" class="grid grid-cols-3 gap-x-2 gap-y-4">
        <City
          v-for="city in filteredCityOptions"
          :key="city.value"
          :city="city"
          :is-selected="selectedCityIds.includes(city.value)"
          :use-pill="true"
          @click="onClickCity"
        />
      </div>
    </div>

    <div class="mt-4 flex justify-center">
      <button v-if="selectedCityIds.length" class="underline" @click="toggleViewSelectedCitiesModal">
        View Selected Cities
      </button>
    </div>

    <Modal
      v-if="isViewSelectedCitiesModalOpen"
      title="Selected Cities"
      :height="400"
      :include-close-button="true"
      @close="toggleViewSelectedCitiesModal"
    >
      <template v-slot:body>
        <div class="py-4 w-full">
          <span v-if="selectedCityIds.length === 0" class="text-center">No cities have been selected.</span>

          <City
            v-for="city in selectedCities"
            :key="city.value"
            :city="city"
            :isSelected="true"
            :onClick="onClickCity"
          />
        </div>
      </template>
    </Modal>
  </div>
</template>
