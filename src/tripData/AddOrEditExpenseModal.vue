<script setup lang="ts">
import { type ExpensePayload, type TripExpense } from "@/api/expense";
import Spinner from "@/app/Spinner.vue";
import Modal from "@/modal/Modal.vue";
import DatePicker from "@/pickers/DatePicker.vue";
import { type PickerOption } from "@/pickers/Picker.vue";
import TimePicker from "@/pickers/TimePicker.vue";
import useAppStore from "@/stores/appStore";
import useTripDataStore from "@/stores/tripDataStore";
import isMobileDevice from "@/utils/isMobile";
import Tooltip from "@/utils/Tooltip.vue";
import { useToast } from "@/utils/useToast";
import { useOnline } from "@vueuse/core";
import { format } from "date-fns";
import { computed, onBeforeMount, reactive, ref, toRefs, watch } from "vue";
import ExpenseCategoryIcon from "./ExpenseCategoryIcon.vue";
import useAddOrEditExpenseModalOptions from "./hooks/useAddOrEditExpenseModalOptions";
import useSyncCurrencyWithSelectedCountry from "./hooks/useSyncCurrencyWithSelectedCountry";

const { expenseToEdit, expenseToCopy } = defineProps<{
  expenseToEdit?: Nullable<TripExpense>;
  expenseToCopy?: Nullable<TripExpense>;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { user } = useAppStore();
const { addExpense, updateExpense, countries } = useTripDataStore();
const $toast = useToast();
const isOnline = useOnline();

const expenseData = reactive<ExpenseData>({
  selectedCountry: null,
  expenseDate: format(new Date(), "yyyy-MM-dd"),
  expenseTime: format(new Date(), "HH:mm"),
  selectedCity: null,
  selectedCurrency: null,
  selectedCategory: null,
  selectedUsers: [],
  description: "",
  amount: null,
});

const { selectedCountry, selectedCurrency } = toRefs(expenseData);

const { countryOptions, cityOptions, currencyOptions, categoryOptions, userOptions } =
  useAddOrEditExpenseModalOptions({ selectedCountry });

useSyncCurrencyWithSelectedCountry({
  selectedCountry,
  selectedCurrency,
  isEditingOrCopyingExpense: !!expenseToEdit || !!expenseToCopy,
});

const parsedAmount = computed(() => {
  if (!expenseData.amount) return 0;
  if (typeof expenseData.amount === "string") return parseFloat(expenseData.amount as string);
  return expenseData.amount as number;
});

const isAddingExpense = ref(false);
const showCurrencyPicker = ref(false);
const showNotes = ref(false);
const amountInput = ref<HTMLInputElement | null>(null);

const onAmountFocus = () => {
  setTimeout(() => {
    if (amountInput.value) {
      const length = amountInput.value.value.length;
      amountInput.value.setSelectionRange(length, length);
    }
  }, 0);
};

const toggleUser = (user: PickerOption) => {
  const index = expenseData.selectedUsers.findIndex((u) => u.value === user.value);
  if (index >= 0) {
    expenseData.selectedUsers.splice(index, 1);
  } else {
    expenseData.selectedUsers.push(user);
  }
};

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
    expenseData.selectedUsers.length > 0
  );
});

const isEditingExpense = computed(() => {
  return !!expenseToEdit;
});

const isCopyingExpense = computed(() => {
  return !!expenseToCopy;
});

const modalTitle = computed(() => {
  if (isEditingExpense.value) return "Edit Expense";
  if (isCopyingExpense.value) return "Copy Expense";
  return "Add Expense";
});

const tooltipOfflineMessage = computed(() => {
  if (expenseToEdit) return "Expense editing is disabled when your offline.";
  return "";
});

const shouldDisableTooltip = computed(() => {
  if (isOnline.value) return true;
  if (!isOnline.value && isEditingExpense.value && expenseToEdit!.id > 0) return false;
  return true;
});

const shouldDisableSaveButton = computed(() => {
  if (!canAddExpense.value) return true;

  if (!isOnline.value && isEditingExpense.value && expenseToEdit!.id > 0) return true;

  return false;
});

watch(
  () => expenseData.selectedCountry?.value,
  (countryId) => {
    const selectedCountry = countries.find((c) => c.id === countryId);
    const selectedCity = selectedCountry?.cities.find((c) => c.id === expenseData?.selectedCity?.value);

    if (!selectedCountry || !selectedCity) expenseData.selectedCity = null;
  },
);

const onClickAddExpense = async () => {
  isAddingExpense.value = true;

  try {
    const payload: ExpensePayload = {
      localDateTime: format(
        new Date(`${expenseData.expenseDate} ${expenseData.expenseTime}:00`),
        "yyyy-MM-dd'T'HH:mm:ss",
      ),
      countryId: expenseData.selectedCountry!.value,
      cityId: expenseData.selectedCity!.value,
      amount: parsedAmount.value,
      currencyId: expenseData.selectedCurrency!.value,
      categoryId: expenseData.selectedCategory!.value,
      description: expenseData.description,
      userIds: expenseData.selectedUsers.map((v) => v.value),
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
    const currentUser = userOptions.value.find((u) => u.value === user?.id) ?? null;
    if (currentUser) {
      expenseData.selectedUsers = [currentUser];
    }
    return;
  }

  const expenseToUseForHydration = isEditingExpense.value ? expenseToEdit! : expenseToCopy!;

  selectedCountry.value = countryOptions.value.find((c) => c.value === expenseToUseForHydration.country.id)!;

  const localDateTime = new Date(expenseToUseForHydration.localDateTime);
  expenseData.expenseDate = format(localDateTime, "yyyy-MM-dd");
  expenseData.expenseTime = format(localDateTime, "HH:mm");

  expenseData.selectedCity = cityOptions.value.find((c) => c.value === expenseToUseForHydration.city.id)!;

  expenseData.selectedCurrency = currencyOptions.value.find(
    (c) => c.value === expenseToUseForHydration.currency.id,
  )!;

  expenseData.amount = parseFloat(expenseToUseForHydration.amount);

  expenseData.selectedCategory = categoryOptions.value.find(
    (c) => c.value === expenseToUseForHydration.category.id,
  )!;

  expenseData.selectedUsers = expenseToUseForHydration.users.map((user) => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.id,
  }));

  if (isCopyingExpense.value) {
    const initalText =
      expenseToUseForHydration.description.length > 0 ? `${expenseToUseForHydration.description} | ` : "";

    expenseData.description = `${initalText}Copied at ${new Date()}`;
    showNotes.value = true;
  } else {
    expenseData.description = expenseToUseForHydration.description;
    showNotes.value = expenseToUseForHydration.description.length > 0;
  }
});
</script>

<template>
  <Modal :title="modalTitle" @close="emit('close')" :height="'auto'">
    <template v-slot:body>
      <div class="et-expense-form">
        <!-- Amount Input - Big and prominent -->
        <div class="et-expense-form__amount-section">
          <div class="et-expense-form__amount-display">
            <button class="et-expense-form__currency-btn" @click="showCurrencyPicker = !showCurrencyPicker">
              {{ expenseData.selectedCurrency?.label?.split("-")[0]?.trim() || "EUR" }}
              <fa-icon :icon="['fas', 'chevron-right']" class="text-xs opacity-50" />
            </button>
            <input
              ref="amountInput"
              class="et-expense-form__amount-input"
              placeholder="0.00"
              :type="isMobileDevice ? 'text' : 'number'"
              :inputmode="isMobileDevice ? 'decimal' : undefined"
              :pattern="isMobileDevice ? '[0-9]+([.][0-9]+)?' : undefined"
              :step="isMobileDevice ? undefined : '.01'"
              :min="isMobileDevice ? undefined : '0'"
              v-model="expenseData.amount"
              @focus="onAmountFocus"
            />
          </div>

          <!-- Currency picker dropdown -->
          <div v-if="showCurrencyPicker" class="et-expense-form__currency-dropdown">
            <button
              v-for="currency in currencyOptions"
              :key="currency.value"
              class="et-expense-form__currency-option"
              :class="{
                'et-expense-form__currency-option--selected':
                  expenseData.selectedCurrency?.value === currency.value,
              }"
              @click="
                expenseData.selectedCurrency = currency;
                showCurrencyPicker = false;
              "
            >
              {{ currency.label }}
            </button>
          </div>
        </div>

        <!-- Category Carousel -->
        <div class="et-expense-form__section">
          <label class="et-expense-form__label">Category</label>
          <div class="et-expense-form__category-carousel">
            <button
              v-for="category in categoryOptions"
              :key="category.value"
              class="et-expense-form__category-chip"
              :class="{
                'et-expense-form__category-chip--selected':
                  expenseData.selectedCategory?.value === category.value,
              }"
              @click="expenseData.selectedCategory = category"
            >
              <ExpenseCategoryIcon
                :category-id="category.value"
                class="et-expense-form__category-chip-icon"
              />
              <span>{{ category.label }}</span>
            </button>
          </div>
        </div>

        <!-- Country Carousel -->
        <div class="et-expense-form__section">
          <label class="et-expense-form__label">Country</label>
          <div class="et-expense-form__location-carousel">
            <button
              v-for="country in countryOptions"
              :key="country.value"
              class="et-expense-form__location-chip"
              :class="{
                'et-expense-form__location-chip--selected': selectedCountry?.value === country.value,
              }"
              @click="selectedCountry = country"
            >
              {{ country.label }}
            </button>
          </div>
        </div>

        <!-- City Carousel -->
        <div class="et-expense-form__section">
          <label class="et-expense-form__label">City</label>
          <div class="et-expense-form__location-carousel">
            <template v-if="cityOptions.length > 0">
              <button
                v-for="city in cityOptions"
                :key="city.value"
                class="et-expense-form__location-chip"
                :class="{
                  'et-expense-form__location-chip--selected': expenseData.selectedCity?.value === city.value,
                }"
                @click="expenseData.selectedCity = city"
              >
                {{ city.label }}
              </button>
            </template>
            <span v-else class="text-slate-500 text-sm italic">Select a country first</span>
          </div>
        </div>

        <!-- Date & Time -->
        <div class="et-expense-form__section">
          <label class="et-expense-form__label">When</label>
          <div class="et-expense-form__row">
            <DatePicker v-model="expenseData.expenseDate" class="flex-1" />
            <TimePicker v-model="expenseData.expenseTime" class="flex-1" />
          </div>
        </div>

        <!-- Paid by -->
        <div class="et-expense-form__section">
          <label class="et-expense-form__label">Paid by</label>
          <div class="et-expense-form__user-chips">
            <button
              v-for="user in userOptions"
              :key="user.value"
              class="et-expense-form__user-chip"
              :class="{
                'et-expense-form__user-chip--selected': expenseData.selectedUsers.some(
                  (u) => u.value === user.value,
                ),
              }"
              @click="toggleUser(user)"
            >
              {{ user.label.split(" ")[0] }}
            </button>
          </div>
        </div>

        <!-- Notes (collapsible) -->
        <div class="et-expense-form__section">
          <button class="et-expense-form__toggle" @click="showNotes = !showNotes">
            <span class="et-expense-form__label">Notes</span>
            <span class="text-slate-500 text-xs">{{ showNotes ? "Hide" : "Add note" }}</span>
          </button>
          <input
            v-if="showNotes"
            class="et-input mt-2"
            v-model="expenseData.description"
            placeholder="Add a note..."
          />
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <Tooltip
        :message="tooltipOfflineMessage"
        :forceOpenOnMobile="true"
        :disabled="shouldDisableTooltip"
        placement="top"
        class="flex-1"
      >
        <button
          class="et-btn-primary w-full et-expense-form__submit"
          :disabled="shouldDisableSaveButton"
          @click="onClickAddExpense"
        >
          <fa-icon v-if="!isEditingExpense && !isCopyingExpense" :icon="['fas', 'plus']" />
          <fa-icon v-if="isEditingExpense" :icon="['fas', 'check']" />
          <fa-icon v-if="isCopyingExpense" :icon="['fas', 'copy']" />
          <span v-if="!isEditingExpense && !isCopyingExpense">Add Expense</span>
          <span v-if="isEditingExpense">Save Changes</span>
          <span v-if="isCopyingExpense">Create Copy</span>
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
  selectedUsers: PickerOption[];
  description: string;
  amount: Nullable<number>;
}
</script>
