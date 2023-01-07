import axios, { AxiosInstance } from "axios";
import {
  GetTripsResponse,
  LoginResponse,
  GetExpensesForTripResponse,
  AddExpenseForTripBody,
  GetTripDataResponse,
  GetTripStatsResponse,
  EditExpenseForTripBody,
  LoadCountriesResponse,
  LoadUsersResponse,
  UploadFileResponse,
  CreateTripPayload,
  CreateTripResponse,
} from "./api.types";
import { store } from "./store";
import { logout } from "./store/slices/app";

let http: AxiosInstance | null = null;

const API_URL =
  process.env.NODE_ENV !== "development"
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

export async function getTripData(tripId: number) {
  const { data } = await http!.get<GetTripDataResponse>(
    `/trips/${tripId}/data`
  );

  return data;
}

export async function getExpensesForTrip(tripId: number) {
  const { data } = await http!.get<GetExpensesForTripResponse>(
    `/trips/${tripId}/expenses`
  );

  return data;
}

export async function getTripStats(tripId: number) {
  const { data } = await http!.get<GetTripStatsResponse>(
    `/trips/${tripId}/stats`
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

export async function loadUsers() {
  const { data } = await http!.get<LoadUsersResponse>("/users");

  return data.users;
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await http!.post<UploadFileResponse>(
    "/files/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data.file;
}

export async function createTrip(payload: CreateTripPayload) {
  const { data } = await http!.post<CreateTripResponse>("/trips", payload);

  return data.trip;
}
