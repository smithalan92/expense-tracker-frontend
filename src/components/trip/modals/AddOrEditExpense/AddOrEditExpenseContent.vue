S
<script setup lang="ts">
import type { ExpensePayload, TripExpense } from "@/api/expense.ts";
import Button from "@/components/ui/button/Button.vue";
import { DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import Field from "@/components/ui/field/Field.vue";
import FieldGroup from "@/components/ui/field/FieldGroup.vue";
import FieldLabel from "@/components/ui/field/FieldLabel.vue";
import FieldLegend from "@/components/ui/field/FieldLegend.vue";
import FieldSet from "@/components/ui/field/FieldSet.vue";
import Input from "@/components/ui/input/Input.vue";
import NativeSelect from "@/components/ui/native-select/NativeSelect.vue";
import NativeSelectOptGroup from "@/components/ui/native-select/NativeSelectOptGroup.vue";
import NativeSelectOption from "@/components/ui/native-select/NativeSelectOption.vue";
import { cn } from "@/lib/utils.ts";
import useAppStore from "@/store/appStore.ts";
import useTripDataStore from "@/store/tripDataStore.ts";
import useUIStateStore from "@/store/uiState.ts";
import { getAvatarStyles } from "@/utils/ui.ts";
import { User, XCircle } from "@lucide/vue";
import { format } from "date-fns";
import { storeToRefs } from "pinia";
import { computed, reactive, toRefs } from "vue";
import { toast } from "vue-sonner";
import CategorySelection from "./CategorySelection.vue";
import useExpenseDataValidation, { type ExpenseData } from "./hooks/useExpenseDataValidation.ts";
import useSyncCurrencyWithSelectedCountry from "./hooks/useSyncCurrencyWithSelectedCountry.ts";

const { expense } = defineProps<{ expense: TripExpense | null }>();
const { setIsAddingOrEditingExpense } = useUIStateStore();
const tripDataStore = useTripDataStore();
const { addExpense, updateExpense } = tripDataStore;
const { countries, userIds } = storeToRefs(tripDataStore);
const { currencies, users } = storeToRefs(useAppStore());

const isEditingExpense = computed(() => !!expense);

const availableCurrencies = computed(() => {
  const availableCurrencyIds = [...countries.value.map((c) => c.currencyId), 149];

  return currencies.value.filter((c) => availableCurrencyIds.includes(c.id));
});

const availableUsers = computed(() => {
  return users.value.filter((u) => userIds.value.includes(u.id));
});

const expenseData = reactive<ExpenseData>({
  expenseDate: format(new Date(), "yyyy-MM-dd HH:mm"),
  selectedCity: null,
  selectedCurrency: availableCurrencies.value[0].id,
  selectedCategory: null,
  selectedUsers: [],
  description: "",
  amount: null,
});

const isDataValid = useExpenseDataValidation(expenseData);

const { selectedCity, selectedCurrency } = toRefs(expenseData);

useSyncCurrencyWithSelectedCountry({
  selectedCity,
  selectedCurrency,
  isEditingOrCopyingExpense: isEditingExpense.value,
});

const formatAmount = () => {
  if (expenseData.amount !== null) {
    const newAmount = Number(expenseData.amount);
    if (isNaN(newAmount) || newAmount < 0) {
      expenseData.amount = "0";
    } else {
      expenseData.amount = newAmount.toFixed(2);
    }
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

const onClickAddOrEditExpense = async () => {
  if (!isDataValid.value) return;

  // Loading

  try {
    const country = countries.value.find(
      (c) => !!c.cities.find((city) => city.id === expenseData.selectedCity!),
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

    if (isEditingExpense.value) {
      await addExpense({ payload });
      toast.success("Expense added.");
    } else {
      await updateExpense({ expenseId: expense!.id, payload });
      toast.success("Expense updated.");
    }

    setIsAddingOrEditingExpense(false);
  } catch (err) {
    console.error(err);
    toast.error("Failed to add or update expense.");
  } finally {
    // Loading...
  }
};
</script>
<template>
  <DrawerContent :disable-outside-pointer-events="true">
    <div class="mx-auto w-full max-w-md overflow-y-auto">
      <DrawerHeader class="flex-row items-center space-between flex-1">
        <DrawerTitle class="text-2xl flex-1">
          <span v-if="isEditingExpense">Edit Expense</span>
          <span v-else>Add Expense</span>
        </DrawerTitle>
        <Button variant="ghost" @click="setIsAddingOrEditingExpense(false)">
          <XCircle class="size-6" />
        </Button>
      </DrawerHeader>

      <div class="flex flex-col px-4 mb-4">
        <!-- When/Where -->
        <FieldGroup class="mt-2 flex-row gap-2">
          <Field class="min-w-0 flex-1">
            <FieldLabel>When</FieldLabel>
            <Input type="datetime-local" v-model="expenseData.expenseDate" class="text-xs" />
          </Field>
          <Field class="w-[160px]">
            <FieldLabel>Where</FieldLabel>
            <NativeSelect v-model="expenseData.selectedCity" placeholder="Select city">
              <NativeSelectOption disabled value="null">Select city</NativeSelectOption>
              <NativeSelectOptGroup v-for="country in countries" :key="country.id" :label="country.name">
                <NativeSelectOption v-for="city in country.cities" :key="city.id" :value="city.id">
                  {{ city.name }}
                </NativeSelectOption>
              </NativeSelectOptGroup>
            </NativeSelect>
          </Field>
        </FieldGroup>

        <!-- Currency/Amount-->
        <FieldSet class="mt-4">
          <FieldLegend variant="label" class="text-text-2">Amount paid</FieldLegend>
          <FieldGroup class="flex-row gap-2">
            <Field class="min-w-0 flex-1">
              <NativeSelect v-model="selectedCurrency">
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
              <Input
                v-model="expenseData.amount"
                type="text"
                placeholder="0.00"
                @blur="formatAmount"
                inputmode="decimal"
                min="0"
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <!-- Category Selection-->
        <div class="flex flex-col mt-4">
          <FieldLegend variant="label" class="text-text-2">Category</FieldLegend>
          <div class="overflow-hidden">
            <CategorySelection
              :selected-category="expenseData.selectedCategory"
              @selected="onSelectCategory"
            />
          </div>
        </div>

        <!-- Description -->
        <Field class="mt-4">
          <FieldLabel>What was paid for</FieldLabel>
          <Input type="text" v-model="expenseData.description" />
        </Field>

        <!-- Users -->
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
      </div>
      <DrawerFooter class="flex-1 pt-2 py-4">
        <Button variant="default" @click="onClickAddOrEditExpense" :disabled="!isDataValid">
          <span v-if="isEditingExpense">Save</span>
          <span v-else>Add</span>
        </Button>
      </DrawerFooter>
    </div>
  </DrawerContent>
</template>
