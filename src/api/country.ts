import getAxios from "./axios";

export async function loadCitiesForCountry(countryId: number) {
  const { data } = await getAxios().get<LoadCitiesForCountryResponse>(`/v2/countries/${countryId}/cities`);

  return data.cities;
}

export interface CityForCountry {
  id: number;
  name: string;
  countryId: number;
}

export interface LoadCitiesForCountryResponse {
  cities: CityForCountry[];
}
