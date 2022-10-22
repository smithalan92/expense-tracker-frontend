import { City, CountryForTrip } from "@/api.types";

export interface NewExpenseState {
  countries: CountryForTrip[];
  isLoadingCountries: boolean;
  hasLoadingCountriesFailed: boolean;
  cities: City[];
  isLoadingCities: boolean;
  hasLoadingCitiesFailed: boolean;
  selectedCountryId: number | null;
  selectedCityId: number | null;
}
