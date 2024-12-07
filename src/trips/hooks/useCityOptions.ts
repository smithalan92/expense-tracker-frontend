import { loadCitiesForCountry, type CityForCountry } from "@/api";
import { computed, ref, watch, type Ref } from "vue";

export default function useCityOptions(
  countryId: Ref<number, number>,
  searchTerm: Ref<string, string>,
) {
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

    if (searchTerm) {
      return options.filter(({ label }) =>
        label.toLowerCase().includes(searchTerm.value.toLowerCase()),
      );
    }

    return options;
  });

  return { cityOptions };
}

export interface CityOption {
  label: string;
  value: number;
}
