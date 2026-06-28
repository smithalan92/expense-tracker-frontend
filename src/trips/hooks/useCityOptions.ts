import { loadCitiesForCountry, type CityForCountry } from "@/api/country";
import { computed, ref, watch, type Ref } from "vue";

export default function useCityOptions(countryId: Ref<number, number>, searchTerm: Ref<string, string>) {
  const cities = ref<CityForCountry[]>([]);

  watch(
    countryId,
    async (newValue) => {
      cities.value = [];
      if (newValue) {
        const data = await loadCitiesForCountry(countryId.value);
        cities.value = data;
      }
    },
    { immediate: true },
  );

  const cityOptions = computed<CityOption[]>(() => {
    const options = cities.value.map(({ name, id }) => ({
      label: name,
      value: id,
    }));

    return options;
  });

  const filteredCityOptions = computed<CityOption[]>(() => {
    if (searchTerm) {
      return cityOptions.value.filter(({ label }) =>
        label.toLowerCase().includes(searchTerm.value.toLowerCase()),
      );
    }

    return cityOptions.value;
  });

  return { cityOptions, filteredCityOptions };
}

export interface CityOption {
  label: string;
  value: number;
}
