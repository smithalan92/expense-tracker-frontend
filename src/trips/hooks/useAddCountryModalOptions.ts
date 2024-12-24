import type { PickerOption } from "@/pickers/Picker.vue";
import useAppStore from "@/stores/appStore";
import { computed } from "vue";

export default function useAddCountryModalOptions() {
  const store = useAppStore();

  const countryOptions = computed<PickerOption[]>(() => {
    return store.countries.map((country) => ({
      label: country.name,
      value: country.id,
    }));
  });

  return {
    countryOptions,
  };
}
