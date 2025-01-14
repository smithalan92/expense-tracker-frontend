import type { PickerOption } from "@/pickers/Picker.vue";
import useAppStore from "@/stores/appStore";
import { watch, type Ref } from "vue";

export default function useSyncCurrencyWithSelectedCountry({
  selectedCountry,
  selectedCurrency,
}: useSyncCurrencyWithSelectedCountryArgs) {
  const { countries } = useAppStore();

  watch(selectedCountry, (newValue) => {
    if (!newValue) return;

    const country = countries.find((c) => c.id === newValue.value);

    if (!country) return;

    selectedCurrency.value = { label: country.currency.name, value: country.currency.id };
  });
}

interface useSyncCurrencyWithSelectedCountryArgs {
  selectedCountry: Ref<Nullable<PickerOption>>;
  selectedCurrency: Ref<Nullable<PickerOption>>;
}
