import { City, Country, ExpenseCategory } from "@/api.types";

export interface NewExpenseState {
  countries: Country[];
  isLoadingCountries: boolean;
  hasLoadedCountries: boolean;
  hasLoadingCountriesFailed: boolean;
  cities: {
    [key: number]: City[];
  };
  isLoadingCities: boolean;
  hasLoadingCitiesFailed: boolean;
  selectedCountryId: number | null;
  selectedCityId: number | null;
  selectedCurrencyId: number | null;
  expenseCategories: ExpenseCategory[];
  selectedCategoryId: number | null;
  isLoadingExpenseCategories: boolean;
  hasLoadingExpenseCategoriesFailed: boolean;
  expenseAmount: number;
  expenseDescription: string;
  expenseDate: string;
  isSavingExpense: boolean;
}
