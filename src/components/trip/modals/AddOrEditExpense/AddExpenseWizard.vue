<script setup lang="ts">
import type { ExpensePayload } from "@/api/expense.ts";
import Button from "@/components/ui/button/Button.vue";
import { DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import Field from "@/components/ui/field/Field.vue";
import FieldGroup from "@/components/ui/field/FieldGroup.vue";
import FieldLabel from "@/components/ui/field/FieldLabel.vue";
import Input from "@/components/ui/input/Input.vue";
import NativeSelect from "@/components/ui/native-select/NativeSelect.vue";
import NativeSelectOptGroup from "@/components/ui/native-select/NativeSelectOptGroup.vue";
import NativeSelectOption from "@/components/ui/native-select/NativeSelectOption.vue";
import Spinner from "@/components/ui/spinner/Spinner.vue";
import useLocationAccess from "@/hooks/useLocationAccess.ts";
import useAppStore from "@/store/appStore.ts";
import useTripDataStore from "@/store/tripDataStore.ts";
import useUIStateStore from "@/store/uiState.ts";
import { cn, getAvatarStyles } from "@/utils/ui.ts";
import { ChevronLeft, User, XCircle } from "@lucide/vue";
import { format, isValid } from "date-fns";
import { storeToRefs } from "pinia";
import { computed, nextTick, onMounted, ref, toRefs, watch } from "vue";
import { toast } from "vue-sonner";
import CategorySelection from "./CategorySelection.vue";
import useExpenseData from "./hooks/useExpenseData.ts";
import useSyncCurrencyWithSelectedCountry from "./hooks/useSyncCurrencyWithSelectedCountry.ts";

const STEPS = [
  { id: "when", title: "When did you pay?" },
  { id: "where", title: "Where were you?" },
  { id: "amount", title: "How much was it?" },
  { id: "category", title: "What category?" },
  { id: "description", title: "What was it for?" },
] as const;

const { setIsAddingExpense } = useUIStateStore();
const tripDataStore = useTripDataStore();
const { addExpense } = tripDataStore;
const { countries, userIds } = storeToRefs(tripDataStore);
const { currencies, users } = storeToRefs(useAppStore());
const { hasLocationAccess, requestLocation, ensureLocationAccess } = useLocationAccess();

const step = ref(0);
const isSaving = ref(false);
const amountInputRef = ref<InstanceType<typeof Input> | null>(null);

const availableCurrencies = computed(() => {
  const availableCurrencyIds = [...countries.value.map((c) => c.currencyId), 149];
  return currencies.value.filter((c) => availableCurrencyIds.includes(c.id));
});

const availableUsers = computed(() => users.value.filter((u) => userIds.value.includes(u.id)));

// Default to euro if available
const defaultCurrency =
  availableCurrencies.value.find((c) => c.code === "EUR") ?? availableCurrencies.value[0];

const { expenseData, isDataValid } = useExpenseData(null, defaultCurrency.id, false);
const { selectedCity, selectedCurrency } = toRefs(expenseData);

useSyncCurrencyWithSelectedCountry({
  selectedCity,
  selectedCurrency,
  isEditingOrCopyingExpense: false,
});

// expenseDate is stored as "yyyy-MM-dd HH:mm"; expose its date and time parts separately.
const datePart = computed({
  get: () => expenseData.expenseDate.split(" ")[0] ?? "",
  set: (value: string) => {
    expenseData.expenseDate = `${value} ${timePart.value}`;
  },
});

const timePart = computed({
  get: () => expenseData.expenseDate.split(" ")[1] ?? "",
  set: (value: string) => {
    expenseData.expenseDate = `${datePart.value} ${value}`;
  },
});

const isStepValid = computed(() => {
  switch (STEPS[step.value].id) {
    case "when":
      return isValid(new Date(expenseData.expenseDate));
    case "where":
      return expenseData.selectedCity !== null;
    case "amount": {
      const amount = parseFloat(expenseData.amount ?? "");
      return expenseData.selectedCurrency !== null && !isNaN(amount) && amount > 0;
    }
    case "category":
      return expenseData.selectedCategory !== null;
    case "description":
      return isDataValid.value;
    default:
      return false;
  }
});

const isLastStep = computed(() => step.value === STEPS.length - 1);

const formatAmount = () => {
  if (expenseData.amount !== null) {
    const newAmount = Number(expenseData.amount);
    expenseData.amount = isNaN(newAmount) || newAmount < 0 ? "0" : newAmount.toFixed(2);
  }
};

const onSelectCategory = (id: number) => {
  expenseData.selectedCategory = id;
};

const onSelectUser = (userId: number) => {
  if (expenseData.selectedUsers.includes(userId)) {
    expenseData.selectedUsers = expenseData.selectedUsers.filter((u) => u !== userId);
  } else {
    expenseData.selectedUsers.push(userId);
  }
};

const onClickClose = () => setIsAddingExpense(false);

const onClickBack = () => {
  if (step.value > 0) step.value--;
};

const onClickNext = () => {
  if (!isStepValid.value) return;
  if (!isLastStep.value) step.value++;
};

const onClickAdd = async () => {
  if (!isDataValid.value || isSaving.value) return;

  try {
    isSaving.value = true;
    const country = countries.value.find((c) =>
      c.cities.some((city) => city.id === expenseData.selectedCity),
    );

    const payload: ExpensePayload = {
      localDateTime: format(new Date(expenseData.expenseDate), "yyyy-MM-dd'T'HH:mm:00"),
      countryId: country!.id,
      cityId: expenseData.selectedCity!,
      amount: parseFloat(expenseData.amount!),
      currencyId: expenseData.selectedCurrency!,
      categoryId: expenseData.selectedCategory!,
      description: expenseData.description,
      userIds: expenseData.selectedUsers,
    };

    if (hasLocationAccess.value) {
      try {
        const { coords } = await requestLocation();
        payload.latlong = `${coords.latitude},${coords.longitude}`;
      } catch {
        // Do nothing if we cant get the location
      }
    }

    await addExpense({ payload });
    toast.success("Expense added.");
    onClickClose();
  } catch (err) {
    console.error(err);
    toast.error("Failed to add expense.");
  } finally {
    isSaving.value = false;
  }
};

watch(step, async (newStep) => {
  if (STEPS[newStep].id !== "amount") return;
  await nextTick();
  amountInputRef.value?.inputRef?.focus();
});

onMounted(() => {
  ensureLocationAccess();
});
</script>
<template>
  <DrawerContent :disable-outside-pointer-events="true">
    <div class="mx-auto w-full max-w-md overflow-y-auto">
      <DrawerHeader class="flex-row items-center space-between flex-1">
        <Button
          v-if="step > 0"
          variant="ghost"
          data-testid="expense-wizard-back-button"
          aria-label="Back"
          @click="onClickBack"
        >
          <ChevronLeft class="size-6" />
        </Button>
        <DrawerTitle class="text-2xl flex-1">
          <span>Add Expense</span>
        </DrawerTitle>
        <Button variant="ghost" data-testid="close-expense-form-button" @click="onClickClose">
          <XCircle class="size-6" />
        </Button>
      </DrawerHeader>

      <div class="px-4">
        <div class="flex gap-1.5" role="progressbar" :aria-valuenow="step + 1" :aria-valuemax="STEPS.length">
          <div
            v-for="(s, i) in STEPS"
            :key="s.id"
            :class="
              cn('h-1 flex-1 rounded-full transition-colors', i <= step ? 'bg-green-300' : 'bg-surface-3')
            "
          />
        </div>
        <p class="mt-2 text-xs text-text-2">Step {{ step + 1 }} of {{ STEPS.length }}</p>
        <h3 class="mt-1 text-lg font-medium" data-testid="expense-wizard-step-title">
          {{ STEPS[step].title }}
        </h3>
      </div>

      <div class="flex flex-col px-4 mt-4 mb-4 min-h-[250px]">
        <!-- Step 1: When -->
        <FieldGroup v-if="STEPS[step].id === 'when'" class="gap-4">
          <Field>
            <FieldLabel>Date</FieldLabel>
            <Input type="date" v-model="datePart" data-testid="expense-date-input" />
          </Field>
          <Field>
            <FieldLabel>Time</FieldLabel>
            <Input type="time" v-model="timePart" data-testid="expense-time-input" />
          </Field>
        </FieldGroup>

        <!-- Step 2: Where -->
        <Field v-else-if="STEPS[step].id === 'where'">
          <FieldLabel>Where</FieldLabel>
          <NativeSelect
            v-model="expenseData.selectedCity"
            placeholder="Select city"
            data-testid="expense-city-select"
          >
            <NativeSelectOption disabled value="null">Select city</NativeSelectOption>
            <NativeSelectOptGroup v-for="country in countries" :key="country.id" :label="country.name">
              <NativeSelectOption v-for="city in country.cities" :key="city.id" :value="city.id">
                {{ city.name }}
              </NativeSelectOption>
            </NativeSelectOptGroup>
          </NativeSelect>
        </Field>

        <!-- Step 3: Currency/Amount -->
        <FieldGroup v-else-if="STEPS[step].id === 'amount'" class="flex-row gap-2">
          <Field class="min-w-0 flex-1">
            <FieldLabel>Currency</FieldLabel>
            <NativeSelect v-model="selectedCurrency" data-testid="expense-currency-select">
              <NativeSelectOption
                v-for="currency in availableCurrencies"
                :key="currency.id"
                :value="currency.id"
              >
                {{ currency.code }} - {{ currency.name }}
              </NativeSelectOption>
            </NativeSelect>
          </Field>
          <Field class="w-[160px]">
            <FieldLabel>Amount</FieldLabel>
            <Input
              ref="amountInputRef"
              v-model="expenseData.amount"
              type="text"
              placeholder="0.00"
              data-testid="expense-amount-input"
              inputmode="decimal"
              @blur="formatAmount"
            />
          </Field>
        </FieldGroup>

        <!-- Step 4: Category -->
        <div v-else-if="STEPS[step].id === 'category'" class="overflow-hidden">
          <CategorySelection
            class="h-full"
            :selected-category="expenseData.selectedCategory"
            @selected="onSelectCategory"
          />
        </div>

        <!-- Step 5: Description (+ who paid, which is required to save) -->
        <template v-else>
          <Field>
            <FieldLabel>What was paid for</FieldLabel>
            <Input type="text" v-model="expenseData.description" data-testid="expense-description-input" />
          </Field>

          <Field class="mt-4">
            <FieldLabel>Who paid</FieldLabel>
            <div class="flex gap-4">
              <Button
                class="p-0 m-0"
                variant="ghost"
                v-for="user in availableUsers"
                :key="user.id"
                @click="onSelectUser(user.id)"
              >
                <div
                  :class="
                    cn(
                      'flex py-2 px-4 rounded-md items-center bg-surface-3',
                      expenseData.selectedUsers.includes(user.id)
                        ? 'border-2 border-green-300 scale-[1.1]'
                        : '',
                    )
                  "
                >
                  <User :class="cn(getAvatarStyles(user).icon, 'size-4 mr-1')" />
                  {{ user.firstName }}
                </div>
              </Button>
            </div>
          </Field>
        </template>
      </div>

      <DrawerFooter class="flex-1 pt-2 py-4">
        <Button
          v-if="isLastStep"
          data-testid="submit-expense-button"
          variant="default"
          :disabled="!isDataValid || isSaving"
          @click="onClickAdd"
        >
          <Spinner class="text-white" v-if="isSaving" />
          <span>Add</span>
        </Button>
        <Button
          v-else
          data-testid="expense-wizard-next-button"
          variant="default"
          :disabled="!isStepValid"
          @click="onClickNext"
        >
          Next
        </Button>
      </DrawerFooter>
    </div>
  </DrawerContent>
</template>
