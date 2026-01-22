<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import City from "./City.vue";
import useCityOptions from "./hooks/useCityOptions";

const props = defineProps<{
  countryId: number;
}>();

const { countryId } = toRefs(props);

const selectedCityIds = defineModel<number[]>({ default: [] });

const searchTerm = ref("");

const { cityOptions, filteredCityOptions } = useCityOptions(countryId, searchTerm);

const selectedCities = computed(() => {
  return selectedCityIds.value
    .map((id) => cityOptions.value.find((option) => option.value === id)!)
    .filter(Boolean);
});

const onClickCity = (cityId: number) => {
  const existingItemIdx = selectedCityIds.value.indexOf(cityId);
  if (existingItemIdx > -1) {
    selectedCityIds.value.splice(existingItemIdx, 1);
  } else {
    selectedCityIds.value.push(cityId);
  }
};

const removeCity = (cityId: number) => {
  const existingItemIdx = selectedCityIds.value.indexOf(cityId);
  if (existingItemIdx > -1) {
    selectedCityIds.value.splice(existingItemIdx, 1);
  }
};

const selectAll = () => {
  selectedCityIds.value = filteredCityOptions.value.map((city) => city.value);
};

const clearAll = () => {
  selectedCityIds.value = [];
};
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-start justify-between mb-3">
      <div>
        <span class="font-bold">Cities (Optional)</span>
        <p class="text-sm text-grey-500 mt-1">
          Select specific cities or leave empty to allow all cities when adding expenses.
        </p>
      </div>
    </div>

    <!-- Selected Cities Chips -->
    <div v-if="selectedCities.length > 0" class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium">Selected ({{ selectedCities.length }})</span>
        <button
          class="text-xs text-sky-400 hover:text-sky-300 transition-colors underline"
          @click="clearAll"
        >
          Clear all
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="city in selectedCities"
          :key="city.value"
          class="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm border border-green-300"
        >
          <span>{{ city.label }}</span>
          <button
            @click="removeCity(city.value)"
            class="hover:text-green-900 transition-colors"
            :aria-label="`Remove ${city.label}`"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Search and Actions -->
    <div class="flex gap-2 mb-3">
      <input
        type="search"
        class="et-input flex-1"
        placeholder="Search cities..."
        v-model="searchTerm"
      />
      <button
        v-if="filteredCityOptions.length > 0"
        class="et-btn-secondary text-sm px-3 whitespace-nowrap"
        @click="selectAll"
      >
        Select all
      </button>
    </div>

    <!-- City Grid -->
    <div class="flex flex-col">
      <span v-if="!filteredCityOptions.length && searchTerm" class="text-sm text-grey-500 text-center py-4">
        No cities match your search
      </span>

      <div
        v-if="filteredCityOptions.length"
        class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2"
      >
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
  </div>
</template>
