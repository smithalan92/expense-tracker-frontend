import { City, CountryForTrip, ExpenseCategory } from "@/api.types";

export interface NewExpenseState {
  countries: CountryForTrip[];
  isLoadingCountries: boolean;
  hasLoadingCountriesFailed: boolean;
  cities: City[];
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
}
