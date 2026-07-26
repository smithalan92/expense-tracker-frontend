import { loadCitiesForCountry, type CityForCountry } from "@/api/country";
import { computed, ref, watch, type Ref } from "vue";

export default function useCityOptions(selectedCountryId: Ref<Nullable<number>, Nullable<number>>) {
  const cities = ref<CityForCountry[]>([]);
  const citySearchTerm = ref("");

  watch(
    selectedCountryId,
    async (newValue) => {
      cities.value = [];
      if (newValue) {
        const data = await loadCitiesForCountry(newValue);
        cities.value = data;
      }
    },
    { immediate: true },
  );

  const filteredCityOptions = computed<CityForCountry[]>(() => {
    if (citySearchTerm.value) {
      return cities.value.filter(({ name }) =>
        name.toLowerCase().includes(citySearchTerm.value.toLowerCase()),
      );
    }

    return cities.value;
  });

  return { cities: filteredCityOptions, citySearchTerm };
}

export interface CityOption {
  label: string;
  value: number;
}
