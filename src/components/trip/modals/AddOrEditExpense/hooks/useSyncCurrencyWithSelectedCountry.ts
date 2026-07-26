import useTripDataStore from "@/store/tripDataStore";
import { storeToRefs } from "pinia";
import { watch, type Ref } from "vue";

export default function useSyncCurrencyWithSelectedCountry({
  selectedCity,
  selectedCurrency,
  isEditingOrCopyingExpense,
}: useSyncCurrencyWithSelectedCountryArgs) {
  const { countries } = storeToRefs(useTripDataStore());

  watch(selectedCity, (newValue) => {
    if (isEditingOrCopyingExpense || !newValue) return;

    const country = countries.value.find(
      (c) => c.cities.find((c) => c.id === selectedCity.value) !== undefined,
    );

    if (!country) return;

    selectedCurrency.value = country.currencyId;
  });
}

interface useSyncCurrencyWithSelectedCountryArgs {
  selectedCity: Ref<Nullable<number>>;
  selectedCurrency: Ref<Nullable<number>>;
  isEditingOrCopyingExpense: boolean;
}
