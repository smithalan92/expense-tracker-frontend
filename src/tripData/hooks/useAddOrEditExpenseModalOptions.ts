import type { PickerOption } from "@/pickers/Picker.vue";
import useAppStore from "@/stores/appStore";
import useTripDataStore from "@/stores/tripDataStore";
import { computed, type Ref } from "vue";

export default function useAddOrEditExpenseModalOptions({
  selectedCountry,
}: useAddOrEditExpenseModalOptionsArgs) {
  const { countries, categories, userIds } = useTripDataStore();
  const { users, currencies } = useAppStore();

  const countryOptions = computed(() => {
    return countries.map<PickerOption>((c) => ({
      label: c.name,
      value: c.id,
    }));
  });

  const cityOptions = computed(() => {
    if (!selectedCountry.value) return [];

    const country = countries.find((c) => c.id === selectedCountry.value?.value);

    if (!country) return [];

    return country.cities.map<PickerOption>((c) => ({
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
    return userIds.map<PickerOption>((id) => {
      const user = users.find((u) => u.id === id)!;

      return {
        label: `${user.firstName} ${user.lastName}`,
        value: user.id,
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
