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
  shouldShowAddExpenseModal: boolean;
  isLoadingExpenses: boolean;
}

export interface AddExpenseParams {
  date: string;
  amount: number;
  cityId: number;
  currencyId: number;
  categoryId: number;
  description: string;
}
