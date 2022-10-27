import { Trip, TripExpense } from "@/api.types";

export interface ParsedTripExpense extends TripExpense {
  isSaved: boolean;
}

export interface ExpenseState {
  expenses: ParsedTripExpense[];
  trip: Trip | null;
  isLoadingExpenses: boolean;
  hasLoadedExpenses: boolean;
  hasFailedToLoadExpenses: boolean;
  unsavedExpenses: ParsedTripExpense[];
  isSyncingUnSavedExpenses: boolean;
  shouldShowAddExpenseModal: boolean;
}
