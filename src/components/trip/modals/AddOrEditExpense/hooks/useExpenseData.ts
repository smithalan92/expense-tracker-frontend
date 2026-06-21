import type { TripExpense } from "@/api/expense.ts";
import { format, isValid } from "date-fns";
import { computed, reactive } from "vue";

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
) {
  const expenseData = reactive<ExpenseData>({
    expenseDate: format(expense?.localDateTime ?? new Date(), DATE_FORMAT),
    selectedCity: expense?.city.id ?? null,
    selectedCurrency: expense?.currency.id ?? defaultCurrencyId,
    selectedCategory: expense?.category.id ?? null,
    selectedUsers: expense?.users.map((u) => u.id) ?? [],
    description: getExpenseDescription({ description: expense?.description, isCopyingExpense }),
    amount: expense?.amount ?? null,
  });

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
