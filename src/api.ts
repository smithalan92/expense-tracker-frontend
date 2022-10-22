import axios, { AxiosInstance } from "axios";
import {
  GetTripsResponse,
  LoginResponse,
  GetExpensesForTripResponse,
  GetCountriesForTripResponse,
  GetCitiesForCountryResponse,
} from "./api.types";
import { store } from "./store";
import { logout } from "./store/slices/app";

let http: AxiosInstance | null = null;

// TODO - Correct url
const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3520"
    : "https://expense-tracker-api.smithy.dev";

export function createInstance(authToken: string) {
  http = axios.create({
    baseURL: API_URL,
    headers: { Authorization: authToken },
  });

  http.interceptors.response.use(undefined, (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        store.dispatch(logout());
        return;
      }
    }

    throw error;
  });
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data } = await axios.post<LoginResponse>(`${API_URL}/login`, {
    email,
    password,
  });

  return data;
}

export async function getTrips() {
  const { data } = await http!.get<GetTripsResponse>("/trips");

  return data.trips;
}

export async function getExpensesForTrip(tripId: number) {
  const { data } = await http!.get<GetExpensesForTripResponse>(
    `/trips/${tripId}/expenses`
  );

  return data;
}

export async function getCountriesForTrip(tripId: number) {
  const { data } = await http!.get<GetCountriesForTripResponse>(
    `/trips/${tripId}/countries`
  );

  return data;
}

export async function getCitiesForCountry(countryId: number) {
  const { data } = await http!.get<GetCitiesForCountryResponse>(
    `/countries/${countryId}/cities`
  );

  return data;
}
