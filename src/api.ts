import axios, { AxiosInstance } from "axios";
import {
  AddExpenseForTripBody,
  CreateTripPayload,
  CreateTripResponse,
  EditExpenseForTripBody,
  GetExpensesForTripResponse,
  GetTripDataResponse,
  GetTripEditDataResponse,
  GetTripStatsResponse,
  GetTripsResponse,
  LoadCitiesForCountryResponse,
  LoadCountriesResponse,
  LoadUsersResponse,
  LoginResponse,
  UploadFileResponse,
} from "./api.types";
import { store } from "./store";
import { logout } from "./store/slices/app";

let http: AxiosInstance | null = null;

const PRODUCTION_API_URL = "https://expense-tracker-api.smithy.dev";
const LOCAL_API_URL = "http://localhost:3520";

const API_URL =
  process.env.NODE_ENV === "development" ? LOCAL_API_URL : PRODUCTION_API_URL;

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

export async function getTripData(tripId: number) {
  const { data } = await http!.get<GetTripDataResponse>(
    `/trips/${tripId}/data`
  );

  return data;
}

export async function getTripForEditing(tripId: number) {
  const { data } = await http!.get<GetTripEditDataResponse>(
    `/trips/${tripId}/edit-data`
  );

  return data;
}

export async function getExpensesForTrip(tripId: number) {
  const { data } = await http!.get<GetExpensesForTripResponse>(
    `/trips/${tripId}/expenses`
  );

  return data;
}

export async function getTripStats(
  tripId: number,
  {
    includeFlights,
    includeHotels,
  }: { includeFlights: boolean; includeHotels: boolean }
) {
  const { data } = await http!.get<GetTripStatsResponse>(
    `/trips/${tripId}/stats?includeFlights=${includeFlights}&includeHotels=${includeHotels}`
  );

  return data;
}

export async function addExpenseToTrip(
  tripId: number,
  expense: AddExpenseForTripBody
) {
  await http!.post(`/trips/${tripId}/expense`, {
    ...expense,
  });
}

export async function editExpenseForTrip(
  tripId: number,
  expenseId: number,
  expenseData: EditExpenseForTripBody
) {
  await http!.patch(`/trips/${tripId}/expense/${expenseId}`, {
    ...expenseData,
  });
}

export async function deleteExpense(tripId: number, expenseId: number) {
  return http!.delete(`/trips/${tripId}/expense/${expenseId}`);
}

export async function loadCountries() {
  const { data } = await http!.get<LoadCountriesResponse>("/countries");

  return data.countries;
}

export async function loadCitiesForCountry(countryId: number) {
  const { data } = await http!.get<LoadCitiesForCountryResponse>(
    `/countries/${countryId}/cities`
  );

  return data.cities;
}

export async function loadUsers() {
  const { data } = await http!.get<LoadUsersResponse>("/users");

  return data.users;
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  // We always want to hit the production API URL for file uploads
  const { data } = await axios.post<UploadFileResponse>(
    `${PRODUCTION_API_URL}/files/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: store.getState().app.authToken,
      },
    }
  );

  return data.file;
}

export async function createTrip(payload: CreateTripPayload) {
  // Note if running locally and after uploading a file, this route
  // will fail if hitting a local API as files are always uploaded via prod
  const { data } = await http!.post<CreateTripResponse>("/trips", payload);

  return data.trip;
}

export async function updateTrip(
  tripId: number,
  payload: Partial<CreateTripPayload>
) {
  // Note if running locally and after uploading a file, this route
  // will fail if hitting a local API as files are always uploaded via prod
  const { data } = await http!.patch<CreateTripResponse>(
    `/trips/${tripId}`,
    payload
  );

  return data.trip;
}

export async function deleteTrip(tripId: number) {
  return http!.delete(`/trips/${tripId}`);
}
