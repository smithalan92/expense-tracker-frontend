import {
  City,
  Country,
  Currency,
  ExpenseCategory,
  GetTripEditDataResponse,
  Trip,
  TripExpense,
  TripUser,
} from "@/api.types";
import { TripModalData } from "@/components/Modals/TripModalHOC/TripModalHOC.types";

export interface ParsedTripExpense extends TripExpense {
  isSaved: boolean;
}

export interface TripDataState {
  expenses: ParsedTripExpense[];
  trip: Trip | Record<string, number>;
  users: TripUser[];
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
  shouldShowTripStatsModal: boolean;
  isDeletingExpense: boolean;
  didDeleteExpense: boolean;
  didDeletingExpenseFail: boolean;
  isEditingExpense: boolean;
  isDeletingTrip: boolean;
  hasDeletedTrip: boolean;
  hasDeletingTripFailed: boolean;
  isUpdatingTrip: boolean;
  hasUpdatingTripFailed: boolean;
}

export interface AddExpenseParams {
  date: string;
  amount: number;
  cityId: number;
  currencyId: number;
  categoryId: number;
  description: string;
  userId: number;
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

export interface UpdateTripThunkPayload {
  tripId: number;
  newData: TripModalData;
  oldData: GetTripEditDataResponse;
}
