import getAxios from "./axios";
import type { ExpenseCategory, TripExpense } from "./expense";

export async function getTrips() {
  const { data } = await getAxios().get<GetTripsResponse>("/v2/trips");

  return data.trips;
}

export async function createTrip(payload: CreateTripPayload) {
  // If a files been uploaded, we have to hit prod, since the files are always uploaded
  // to prod
  const base = payload.file ? import.meta.env.VITE_PRODUCTION_API_URL : "";

  const { data } = await getAxios().post<CreateTripResponse>(`${base}/v2/trip`, payload);

  return data.trip;
}

export async function getTripData(tripId: number) {
  const { data } = await getAxios().get<GetTripDataResponse>(`/trips/${tripId}/data`);

  return data;
}

export async function updateTrip(tripId: number, payload: Partial<CreateTripPayload>) {
  // If a files been uploaded, we have to hit prod, since the files are always uploaded
  // to prod
  const url = payload.file ? import.meta.env.VITE_PRODUCTION_API_URL : "/trips";

  const { data } = await getAxios().patch<CreateTripResponse>(`${url}/${tripId}`, payload);

  return data.trip;
}

export async function deleteTrip(tripId: number) {
  return getAxios().delete(`/trips/${tripId}`);
}

// TODO - Remove need for this API
export async function getTripForEditing(tripId: number) {
  const { data } = await getAxios().get<GetTripEditDataResponse>(`/trips/${tripId}/edit-data`);

  return data;
}

export interface Trip {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  image: string;
  totalExpenseAmount: number;
}

interface GetTripsResponse {
  trips: Trip[];
}

export interface CreateTripPayload {
  name: string;
  startDate: string;
  endDate: string;
  file?: string;
  countries: CreateTripCountry[];
  userIds: number[];
}

export interface CreateTripCountry {
  countryId: number;
  cityIds?: number[];
}

export interface CreateTripResponse {
  trip: Trip;
}

export interface GetTripDataResponse {
  expenses: TripExpense[];
  trip: Trip;
  countries: Country[];
  cities: City[];
  currencies: Currency[];
  categories: ExpenseCategory[];
  users: Record<string, { firstName: string; lastName: string }>;
}

export interface Country {
  id: number;
  name: string;
  currencyId: number;
  currencyCode: string;
}

export interface City {
  id: number;
  name: string;
  timezoneName: string;
  countryId: number;
}

export interface Currency {
  id: number;
  code: string;
  name: string;
}

export interface GetTripEditDataResponse {
  image: Nullable<string>;
  name: string;
  startDate: string;
  endDate: string;
  countries: CountryWithCities[];
  userIds: number[];
}

export interface CountryWithCities {
  name: string;
  countryId: number;
  cityIds?: number[];
}
