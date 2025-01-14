import getAxios from "./axios";
import type { TripExpense } from "./expense";

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
  const { data } = await getAxios().get<GetTripDataResponse>(`/v2/trip/${tripId}`);

  return data;
}

export async function updateTrip(tripId: number, payload: Partial<CreateTripPayload>) {
  // If a files been uploaded, we have to hit prod, since the files are always uploaded
  // to prod
  const url = payload.file ? import.meta.env.VITE_PRODUCTION_API_URL : "";

  const { data } = await getAxios().patch<UpdateTripResponse>(`${url}/v2/trip/${tripId}`, payload);

  return data;
}

export async function deleteTrip(tripId: number) {
  return getAxios().delete(`/trips/${tripId}`);
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

export interface UpdateTripResponse {
  trip: Trip;
  countries: TripCountry[];
  userIds: number[];
  currencyIds: number[];
}

export interface GetTripDataResponse {
  trip: Trip;
  countries: TripCountry[];
  userIds: number[];
  currencyIds: number[];
  categories: Category[];
  expenses: TripExpense[];
}

export interface TripCountry {
  id: number;
  name: string;
  currencyId: number;
  cities: Array<{ id: number; name: string }>;
}

interface Category {
  id: number;
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

interface CountryWithCities {
  name: string;
  countryId: number;
  cityIds?: number[];
}
