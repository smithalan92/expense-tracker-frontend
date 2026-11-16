import type { TripExpense } from "@/api/expense.ts";
import type { TripCountry } from "@/api/trip.ts";
import useAppStore from "@/store/appStore";
import { format, isValid } from "date-fns";
import { storeToRefs } from "pinia";
import { computed, reactive } from "vue";
import useNearestCity from "./useNearestCity.ts";

const DATE_FORMAT = "yyyy-MM-dd HH:mm";

const getExpenseDescription = ({
  description,
  isCopyingExpense,
}: {
  description?: string;
  isCopyingExpense: boolean;
}) => {
  let desc = description ?? "";

  if (isCopyingExpense) {
    desc = `[CP] ${desc}`;
  }

  return desc;
};

export default function useExpenseData(
  expense: TripExpense | null,
  defaultCurrencyId: number,
  isCopyingExpense: boolean,
  countries: TripCountry[] = [],
) {
  const appStore = useAppStore();
  const { shouldUseAutoCityDetection, user } = storeToRefs(appStore);
  const defaultSelectedUser = user.value?.id ? [user.value.id] : [];

  const expenseData = reactive<ExpenseData>({
    expenseDate: format(expense?.localDateTime ?? new Date(), DATE_FORMAT),
    selectedCity: expense?.city.id ?? null,
    selectedCurrency: expense?.currency.id ?? defaultCurrencyId,
    selectedCategory: expense?.category.id ?? null,
    selectedUsers: expense?.users.map((u) => u.id) ?? defaultSelectedUser,
    description: getExpenseDescription({ description: expense?.description, isCopyingExpense }),
    amount: expense?.amount ?? null,
  });

  // For a brand new expense, default the city to the one nearest the user (if we can get their location)
  if (!expense && shouldUseAutoCityDetection.value && countries.length > 0) {
    const { getNearestCityId } = useNearestCity();

    getNearestCityId(countries).then((cityId) => {
      // Don't override a city the user picked while we were waiting on the location
      if (cityId !== null && expenseData.selectedCity === null) {
        expenseData.selectedCity = cityId;
      }
    });
  }

  const hasOriginalDataChanged = computed(() => {
    if (!expense) return true;

    const areDatesTheSame =
      format(new Date(expense.localDateTime), DATE_FORMAT) ===
      format(new Date(expenseData.expenseDate), DATE_FORMAT);

    const areCitiesTheSame = expense.city.id === expenseData.selectedCity;

    const areCurrenciesTheSame = expense.currency.id === expenseData.selectedCurrency;
    const areAmountsTheSame = parseFloat(expense.amount) === parseFloat(expenseData.amount ?? "");

    const areCategoriesTheSame = expense.category.id === expenseData.selectedCategory;
    const areDescriptionsTheSame = expense.description.trim() === expenseData.description.trim();

    const originalUserIds = expense.users.map((u) => u.id).sort();
    const newUserIds = [...expenseData.selectedUsers].sort();
    const areUserIdsTheSame = JSON.stringify(originalUserIds) === JSON.stringify(newUserIds);

    return (
      !areDatesTheSame ||
      !areCitiesTheSame ||
      !areCurrenciesTheSame ||
      !areUserIdsTheSame ||
      !areCategoriesTheSame ||
      !areDescriptionsTheSame ||
      !areAmountsTheSame
    );
  });

  const isDataValid = computed(() => {
    if (!hasOriginalDataChanged.value) return false;

    if (!isValid(new Date(expenseData.expenseDate))) return false;
    if (expenseData.selectedCity === null) return false;
    if (expenseData.selectedCurrency === null) return false;
    if (expenseData.selectedCategory === null) return false;
    if (expenseData.selectedUsers.length === 0) return false;
    if (expenseData.description.trim() === "") return false;

    const amount = parseFloat(expenseData.amount ?? "");

    if (isNaN(amount) || amount <= 0) return false;

    return true;
  });

  return { expenseData, isDataValid };
}

export interface ExpenseData {
  expenseDate: string;
  selectedCity: Nullable<number>;
  selectedCurrency: Nullable<number>;
  selectedCategory: Nullable<number>;
  selectedUsers: number[];
  description: string;
  amount: Nullable<string>;
}
