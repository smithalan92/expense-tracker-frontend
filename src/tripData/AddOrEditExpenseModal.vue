<script setup lang="ts">
import { type AddExpenseForTripBody, type TripExpense } from "@/api";
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
import { computed, onBeforeMount, reactive, ref, toRefs, watch } from "vue";
import useAddOrEditExpenseModalOptions from "./hooks/useAddOrEditExpenseModalOptions";

const { expenseToEdit, expenseToCopy } = defineProps<{
  expenseToEdit?: Nullable<TripExpense>;
  expenseToCopy?: Nullable<TripExpense>;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { user } = useAppStore();
const { trip, addExpense, updateExpense, cities } = useTripDataStore();
const $toast = useToast();
const isOnline = useOnline();

const expenseData = reactive<ExpenseData>({
  selectedCountry: null,
  expenseDate: format(new Date(), "yyyy-MM-dd"),
  expenseTime: format(new Date(), "HH:mm"),
  selectedCity: null,
  selectedCurrency: null,
  selectedCategory: null,
  selectedUser: null,
  description: "",
  amount: 0,
});

const { selectedCountry } = toRefs(expenseData);

const { countryOptions, cityOptions, currencyOptions, categoryOptions, userOptions } =
  useAddOrEditExpenseModalOptions({ selectedCountry });

const parsedAmount = computed(() => {
  if (!expenseData.amount) return 0;
  if (typeof expenseData.amount === "string") return parseFloat(expenseData.amount as string);
  return expenseData.amount as number;
});

const isAddingExpense = ref(false);

const canAddExpense = computed(() => {
  const isAmountValid = parsedAmount.value > 0;

  return (
    !!expenseData.expenseDate &&
    !!expenseData.expenseTime &&
    expenseData.selectedCountry !== null &&
    expenseData.selectedCity !== null &&
    expenseData.selectedCurrency !== null &&
    isAmountValid &&
    expenseData.selectedCategory !== null &&
    expenseData.selectedUser !== null
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
  () => expenseData.selectedCountry?.value,
  (countryId) => {
    const city = cities.find((o) => o.id === expenseData.selectedCity?.value)!;

    if (countryId !== city?.countryId) expenseData.selectedCity = null;
  },
);

const onClickAddExpense = async () => {
  isAddingExpense.value = true;

  try {
    const payload: AddExpenseForTripBody = {
      localDateTime: format(
        new Date(`${expenseData.expenseDate} ${expenseData.expenseTime}:00`),
        "yyyy-MM-dd'T'HH:mm:ss",
      ),
      cityId: expenseData.selectedCity!.value,
      amount: parsedAmount.value,
      currencyId: expenseData.selectedCurrency!.value,
      categoryId: expenseData.selectedCategory!.value,
      description: expenseData.description,
      userId: expenseData.selectedUser!.value,
    };

    if (isEditingExpense.value) {
      await updateExpense({ expenseId: expenseToEdit!.id, payload });
    } else {
      await addExpense({ payload });
    }

    emit("close");
  } catch (err) {
    console.error(err);
    $toast.error("Failed to add or update expense.");
  } finally {
    isAddingExpense.value = false;
  }
};

onBeforeMount(() => {
  if (!isEditingExpense.value && !isCopyingExpense.value) {
    expenseData.selectedUser = userOptions.value.find((u) => u.value === user?.id) ?? null;
    return;
  }

  const expenseToUseForHydration = isEditingExpense.value ? expenseToEdit! : expenseToCopy!;

  selectedCountry.value = countryOptions.value.find(
    (c) => c.value === expenseToUseForHydration.country.id,
  )!;

  const localDateTime = new Date(expenseToUseForHydration.localDateTime);
  expenseData.expenseDate = format(localDateTime, "yyyy-MM-dd");
  expenseData.expenseTime = format(localDateTime, "HH:mm");

  expenseData.selectedCity = cityOptions.value.find(
    (c) => c.value === expenseToUseForHydration.city.id,
  )!;

  expenseData.selectedCurrency = currencyOptions.value.find(
    (c) => c.value === expenseToUseForHydration.currency.id,
  )!;

  expenseData.amount = parseFloat(expenseToUseForHydration.amount);

  expenseData.selectedCategory = categoryOptions.value.find(
    (c) => c.value === expenseToUseForHydration.category.id,
  )!;

  expenseData.selectedUser = userOptions.value.find(
    (u) => u.value === expenseToUseForHydration.user.id,
  )!;

  if (isCopyingExpense.value) {
    const initalText =
      expenseToUseForHydration.description.length > 0
        ? `${expenseToUseForHydration.description} | `
        : "";

    expenseData.description = `${initalText}Copied at ${new Date()}`;
  } else {
    expenseData.description = expenseToUseForHydration.description;
  }
});
</script>

<template>
  <Modal title="Add Expense" @close="emit('close')">
    <template v-slot:body>
      <div class="grid grid-cols-5 gap-x-4 py-4">
        <span class="col-span-1 content-center">When</span>
        <span class="col-span-2"> <DatePicker v-model="expenseData.expenseDate" /> </span>
        <span class="col-span-2"><TimePicker v-model="expenseData.expenseTime" /></span>
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
          v-model="expenseData.selectedCity"
          placeholder="Select city"
          :disabled="!selectedCountry"
        />
      </div>

      <div class="grid grid-cols-5 gap-1 py-4">
        <span class="col-span-1 content-center">Amount</span>
        <Picker
          class="col-span-2"
          :options="currencyOptions"
          v-model="expenseData.selectedCurrency"
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
          v-model="expenseData.amount"
        />
        <input
          v-if="!isMobileDevice"
          class="col-span-2 input input-md h-auto input-bordered rounded-md bg-white text-black outline-none focus:outline-none"
          placeholder="0"
          type="number"
          step=".01"
          min="0"
          v-model="expenseData.amount"
        />
      </div>

      <div class="grid grid-cols-5 gap-1 py-4">
        <span class="col-span-1 content-center">Category</span>
        <Picker
          class="col-span-4"
          :options="categoryOptions"
          v-model="expenseData.selectedCategory"
          placeholder="Select category"
        />
      </div>

      <div class="grid grid-cols-5 gap-1 py-4">
        <span class="col-span-1 content-center">Person</span>
        <Picker
          class="col-span-4"
          :options="userOptions"
          v-model="expenseData.selectedUser"
          placeholder="Select user"
        />
      </div>

      <div class="grid grid-cols-5 gap-1 py-4">
        <span class="col-span-1 content-center">Notes</span>
        <input
          class="col-span-4 textarea rounded-md bg-white textarea-bordered outline-none focus:outline-none"
          v-model="expenseData.description"
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
<script lang="ts">
interface ExpenseData {
  selectedCountry: Nullable<PickerOption>;
  expenseDate: string;
  expenseTime: string;
  selectedCity: Nullable<PickerOption>;
  selectedCurrency: Nullable<PickerOption>;
  selectedCategory: Nullable<PickerOption>;
  selectedUser: Nullable<PickerOption>;
  description: string;
  amount: number;
}
</script>
