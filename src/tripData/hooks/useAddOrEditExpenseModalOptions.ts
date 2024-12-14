import type { PickerOption } from "@/pickers/Picker.vue";
import useTripDataStore from "@/stores/tripDataStore";
import { computed, type Ref } from "vue";

export default function useAddOrEditExpenseModalOptions({
  selectedCountry,
}: useAddOrEditExpenseModalOptionsArgs) {
  const { countries, cities, currencies, categories, users } = useTripDataStore();

  const countryOptions = computed(() => {
    return countries.map<PickerOption>((c) => ({
      label: c.name,
      value: c.id,
    }));
  });

  const cityOptions = computed(() => {
    if (!selectedCountry.value) return [];

    return cities
      .filter((c) => c.countryId === selectedCountry.value!.value)
      .map<PickerOption>((c) => ({
        label: c.name,
        value: c.id,
      }));
  });

  const currencyOptions = computed(() => {
    const availableCurrencyIds = [...countries.map((c) => c.currencyId), 149];

    return currencies
      .filter((c) => availableCurrencyIds.includes(c.id))
      .map<PickerOption>((c) => ({
        label: `${c.code} - ${c.name}`,
        value: c.id,
      }));
  });

  const categoryOptions = computed(() => {
    return categories.map<PickerOption>((c) => ({
      label: c.name,
      value: c.id,
    }));
  });

  const userOptions = computed(() => {
    return Object.keys(users).map<PickerOption>((k) => {
      const u = users[k];

      return {
        label: `${u.firstName} ${u.lastName}`,
        value: parseInt(k, 10),
      };
    });
  });

  return {
    countryOptions,
    cityOptions,
    currencyOptions,
    categoryOptions,
    userOptions,
  };
}

interface useAddOrEditExpenseModalOptionsArgs {
  selectedCountry: Ref<Nullable<PickerOption>, Nullable<PickerOption>>;
}
