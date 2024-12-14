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
import { useToast } from "@/utils/useToast";
import { format } from "date-fns";
import { computed, onBeforeMount, ref, watch } from "vue";
import useAddOrEditExpenseModalOptions from "./hooks/useAddOrEditExpenseModalOptions";

const { expenseToEdit } = defineProps<{
  expenseToEdit?: Nullable<TripExpense>;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const isEditingExpense = computed(() => {
  return expenseToEdit !== null && expenseToEdit !== undefined;
});

const { user } = useAppStore();
const { trip, loadTrip, cities } = useTripDataStore();
const $toast = useToast();

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

    loadTrip(trip.id);
    emit("close");
  } catch (err) {
    console.error(err);
    $toast.error("Failed to add expense.");
  } finally {
    isAddingExpense.value = false;
  }
};

onBeforeMount(() => {
  if (isEditingExpense.value && expenseToEdit) {
    selectedCountry.value = countryOptions.value.find((c) => c.value === expenseToEdit.country.id)!;

    const localDateTime = new Date(expenseToEdit.localDateTime);
    expenseDate.value = format(localDateTime, "yyyy-MM-dd");
    expenseTime.value = format(localDateTime, "HH:mm");

    selectedCity.value = cityOptions.value.find((c) => c.value === expenseToEdit.city.id)!;

    selectedCurrency.value = currencyOptions.value.find(
      (c) => c.value === expenseToEdit.currency.id,
    )!;

    amount.value = parseFloat(expenseToEdit.amount);

    selectedCategory.value = categoryOptions.value.find(
      (c) => c.value === expenseToEdit.category.id,
    )!;

    selectedUser.value = userOptions.value.find((u) => u.value === expenseToEdit.user.id)!;

    description.value = expenseToEdit.description;
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

      <button
        class="btn btn-primary font-bold text-md"
        :disabled="!canAddExpense"
        @click="onClickAddExpense"
      >
        <span v-if="!isEditingExpense">Add expense</span>
        <span v-if="isEditingExpense">Edit expense</span>
      </button>
    </template>
  </Modal>
  <Spinner v-if="isAddingExpense" :use-overlay="true" />
</template>
