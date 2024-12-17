<script setup lang="ts">
import {
  addExpenseToTrip,
  editExpenseForTrip,
  type AddExpenseForTripBody,
  type TripExpense,
} from "@/api";
import Spinner from "@/app/Spinner.vue";
import Modal from "@/modal/Modal.vue";
import DatePicker from "@/pickers/DatePicker.vue";
import Picker, { type PickerOption } from "@/pickers/Picker.vue";
import TimePicker from "@/pickers/TimePicker.vue";
import useAppStore from "@/stores/appStore";
import useTripDataStore from "@/stores/tripDataStore";
import isMobileDevice from "@/utils/isMobile";
import Tooltip from "@/utils/Tooltip.vue";
import { useToast } from "@/utils/useToast";
import { useOnline } from "@vueuse/core";
import { format } from "date-fns";
import { computed, onBeforeMount, ref, watch } from "vue";
import useAddOrEditExpenseModalOptions from "./hooks/useAddOrEditExpenseModalOptions";

const { expenseToEdit, expenseToCopy } = defineProps<{
  expenseToEdit?: Nullable<TripExpense>;
  expenseToCopy?: Nullable<TripExpense>;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { user } = useAppStore();
const { trip, loadTripData, cities } = useTripDataStore();
const $toast = useToast();
const isOnline = useOnline();

const selectedCountry = ref<Nullable<PickerOption>>(null);

const { countryOptions, cityOptions, currencyOptions, categoryOptions, userOptions } =
  useAddOrEditExpenseModalOptions({ selectedCountry });

const expenseDate = ref(format(new Date(), "yyyy-MM-dd"));
const expenseTime = ref(format(new Date(), "HH:mm"));
const selectedCity = ref<Nullable<PickerOption>>(null);
const selectedCurrency = ref<Nullable<PickerOption>>(null);
const amount = ref<Nullable<number | string>>(null);
const parsedAmount = computed(() => {
  if (!amount.value) return 0;
  if (typeof amount.value === "string") return parseFloat(amount.value as string);
  return amount.value as number;
});

const selectedCategory = ref<Nullable<PickerOption>>(null);
const selectedUser = ref<Nullable<PickerOption>>(
  userOptions.value.find((u) => u.value === user!.id)!,
);
const description = ref("");

const isAddingExpense = ref(false);

const canAddExpense = computed(() => {
  const isAmountValid = parsedAmount.value > 0;

  return (
    !!expenseDate.value &&
    !!expenseTime.value &&
    selectedCountry.value !== null &&
    selectedCity.value !== null &&
    selectedCurrency.value !== null &&
    isAmountValid &&
    selectedCategory.value !== null &&
    selectedUser.value !== null
  );
});

const isEditingExpense = computed(() => {
  return !!expenseToEdit;
});

const isCopyingExpense = computed(() => {
  return !!expenseToCopy;
});

const tooltipOfflineMessage = computed(() => {
  if (expenseToEdit) return "Trip editing is disabled when your offline.";
  if (expenseToCopy) return "Trip copying is disabled when your offline.";
  return "Adding a trip is disabled while offline";
});

watch(
  () => selectedCountry.value?.value,
  (countryId) => {
    const city = cities.find((o) => o.id === selectedCity.value?.value)!;

    if (countryId !== city?.countryId) selectedCity.value = null;
  },
);

const onClickAddExpense = async () => {
  isAddingExpense.value = true;

  try {
    const payload: AddExpenseForTripBody = {
      localDateTime: format(
        new Date(`${expenseDate.value} ${expenseTime.value}:00`),
        "yyyy-MM-dd'T'HH:mm:ss",
      ),
      cityId: selectedCity.value!.value,
      amount: parsedAmount.value,
      currencyId: selectedCurrency.value!.value,
      categoryId: selectedCategory.value!.value,
      description: description.value,
      userId: selectedUser.value!.value,
    };

    if (isEditingExpense.value) {
      await editExpenseForTrip(trip.id, expenseToEdit!.id, payload);
    } else {
      await addExpenseToTrip(trip.id, payload);
    }

    loadTripData(trip.id);
    emit("close");
  } catch (err) {
    console.error(err);
    $toast.error("Failed to add or update expense.");
  } finally {
    isAddingExpense.value = false;
  }
};

onBeforeMount(() => {
  if (!isEditingExpense.value && !isCopyingExpense.value) return;

  const expenseToUseForHydration = isEditingExpense.value ? expenseToEdit! : expenseToCopy!;

  selectedCountry.value = countryOptions.value.find(
    (c) => c.value === expenseToUseForHydration.country.id,
  )!;

  const localDateTime = new Date(expenseToUseForHydration.localDateTime);
  expenseDate.value = format(localDateTime, "yyyy-MM-dd");
  expenseTime.value = format(localDateTime, "HH:mm");

  selectedCity.value = cityOptions.value.find((c) => c.value === expenseToUseForHydration.city.id)!;

  selectedCurrency.value = currencyOptions.value.find(
    (c) => c.value === expenseToUseForHydration.currency.id,
  )!;

  amount.value = parseFloat(expenseToUseForHydration.amount);

  selectedCategory.value = categoryOptions.value.find(
    (c) => c.value === expenseToUseForHydration.category.id,
  )!;

  selectedUser.value = userOptions.value.find((u) => u.value === expenseToUseForHydration.user.id)!;

  if (isCopyingExpense.value) {
    const initalText =
      expenseToUseForHydration.description.length > 0
        ? `${expenseToUseForHydration.description} | `
        : "";

    description.value = `${initalText}Copied at ${new Date()}`;
  } else {
    description.value = expenseToUseForHydration.description;
  }
});
</script>

<template>
  <Modal title="Add Expense" @close="emit('close')">
    <template v-slot:body>
      <div class="grid grid-cols-5 gap-x-4 py-4">
        <span class="col-span-1 content-center">When</span>
        <span class="col-span-2"> <DatePicker v-model="expenseDate" /> </span>
        <span class="col-span-2"><TimePicker v-model="expenseTime" /></span>
      </div>

      <div class="grid grid-cols-5 gap-1 py-4">
        <span class="col-span-1 content-center">Where</span>
        <Picker
          class="col-span-2"
          :options="countryOptions"
          v-model="selectedCountry"
          placeholder="Select country"
        />
        <Picker
          class="col-span-2"
          :options="cityOptions"
          v-model="selectedCity"
          placeholder="Select city"
          :disabled="!selectedCountry"
        />
      </div>

      <div class="grid grid-cols-5 gap-1 py-4">
        <span class="col-span-1 content-center">Amount</span>
        <Picker
          class="col-span-2"
          :options="currencyOptions"
          v-model="selectedCurrency"
          placeholder="Select currency"
        />
        <!-- this input will force the numpad on Safari on IOS, unlike type=-->
        <input
          v-if="isMobileDevice"
          class="col-span-2 input input-md h-auto input-bordered rounded-md bg-white text-black outline-none focus:outline-none"
          placeholder="0"
          type="text"
          inputmode="numeric"
          pattern="\d*"
          v-model="amount"
        />
        <input
          v-if="!isMobileDevice"
          class="col-span-2 input input-md h-auto input-bordered rounded-md bg-white text-black outline-none focus:outline-none"
          placeholder="0"
          type="number"
          step=".01"
          min="0"
          v-model="amount"
        />
      </div>

      <div class="grid grid-cols-5 gap-1 py-4">
        <span class="col-span-1 content-center">Category</span>
        <Picker
          class="col-span-4"
          :options="categoryOptions"
          v-model="selectedCategory"
          placeholder="Select category"
        />
      </div>

      <div class="grid grid-cols-5 gap-1 py-4">
        <span class="col-span-1 content-center">Person</span>
        <Picker
          class="col-span-4"
          :options="userOptions"
          v-model="selectedUser"
          placeholder="Select user"
        />
      </div>

      <div class="grid grid-cols-5 gap-1 py-4">
        <span class="col-span-1 content-center">Notes</span>
        <input
          class="col-span-4 textarea rounded-md bg-white textarea-bordered outline-none focus:outline-none"
          v-model="description"
        />
      </div>
    </template>

    <template v-slot:footer>
      <button class="btn btn-secondary font-bold text-md mr-4" @click="emit('close')">
        Cancel
      </button>

      <Tooltip
        :message="tooltipOfflineMessage"
        :forceOpenOnMobile="true"
        :disabled="isOnline"
        placement="top"
      >
        <button
          class="btn btn-primary font-bold text-md"
          :disabled="!canAddExpense || !isOnline"
          @click="onClickAddExpense"
        >
          <span v-if="!isEditingExpense && !isCopyingExpense">Add expense</span>
          <span v-if="isEditingExpense">Edit expense</span>
          <span v-if="isCopyingExpense">Copy expense</span>
        </button>
      </Tooltip>
    </template>
  </Modal>
  <Spinner v-if="isAddingExpense" :use-overlay="true" />
</template>
