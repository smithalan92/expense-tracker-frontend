import getAxios from "./axios";
import type { City } from "./trip";

export async function loadCitiesForCountry(countryId: number) {
  const { data } = await getAxios().get<LoadCitiesForCountryResponse>(`/v2/countries/${countryId}/cities`);

  return data.cities;
}

export type CityForCountry = Omit<City, "timezoneName">;

export interface LoadCitiesForCountryResponse {
  cities: CityForCountry[];
}
