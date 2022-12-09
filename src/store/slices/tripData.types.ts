import {
  City,
  Country,
  Currency,
  ExpenseCategory,
  Trip,
  TripExpense,
} from "@/api.types";

export interface ParsedTripExpense extends TripExpense {
  isSaved: boolean;
}

export interface TripDataState {
  expenses: ParsedTripExpense[];
  trip: Trip | Record<string, number>;
  countries: Country[];
  cities: City[];
  currencies: Currency[];
  categories: ExpenseCategory[];
  isLoadingTripData: boolean;
  hasLoadedTripData: boolean;
  hasFailedToTripData: boolean;
  isAddingExpense: boolean;
  unsavedExpenses: ParsedTripExpense[];
  isSyncingUnSavedExpenses: boolean;
  isLoadingExpenses: boolean;
  shouldShowAddExpenseModal: boolean;
  shouldShowEditExpenseModal: boolean;
  shouldShowTripStatsModal: boolean;
  isDeletingExpense: boolean;
  didDeleteExpense: boolean;
  didDeletingExpenseFail: boolean;
  isEditingExpense: boolean;
}

export interface AddExpenseParams {
  date: string;
  amount: number;
  cityId: number;
  currencyId: number;
  categoryId: number;
  description: string;
}

export interface EditExpenseParams extends Partial<AddExpenseParams> {
  tripId: number;
  expenseId: number;
  countryId?: number;
}

export interface DeleteExpenseFufilledActionParams {
  tripId: number;
  expenseId: number;
}
