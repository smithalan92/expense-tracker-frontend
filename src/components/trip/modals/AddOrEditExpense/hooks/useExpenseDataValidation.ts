import { isValid } from "date-fns";
import { computed, type Reactive } from "vue";

export default function useExpenseDataValidation(data: Reactive<ExpenseData>) {
  const isDataValid = computed(() => {
    if (!isValid(new Date(data.expenseDate))) return false;
    if (data.selectedCity === null) return false;
    if (data.selectedCurrency === null) return false;
    if (data.selectedCategory === null) return false;
    if (data.selectedUsers.length === 0) return false;
    if (data.description.trim() === "") return false;

    const amount = parseFloat(data.amount ?? "");

    if (isNaN(amount) || amount <= 0) return false;

    return true;
  });

  return isDataValid;
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
