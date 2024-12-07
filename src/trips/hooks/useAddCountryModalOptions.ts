import { loadCountries, type Country } from "@/api";
import type { PickerOption } from "@/pickers/Picker.vue";
import { computed, onMounted, ref } from "vue";

export default function useAddCountryModalOptions() {
  const countries = ref<Country[]>([]);

  onMounted(async () => {
    const data = await loadCountries();
    countries.value = data;
  });

  const countryOptions = computed<PickerOption[]>(() => {
    return countries.value.map((country) => ({
      label: country.name,
      value: country.id,
    }));
  });

  return {
    countryOptions,
  };
}
