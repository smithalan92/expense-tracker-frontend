import { Trip, TripExpense } from "@/api.types";

export interface ExpenseState {
  expenses: TripExpense[] | null;
  trip: Trip | null;
  isLoadingExpenses: boolean;
  hasLoadedExpenses: boolean;
  hasFailedToLoadExpenses: boolean;
  shouldShowAddExpenseModal: boolean;
}
