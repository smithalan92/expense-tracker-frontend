import axios, { type AxiosInstance } from "axios";
import useAppStore from "./stores/appStore";

let http: Nullable<AxiosInstance> = null;

const PRODUCTION_API_URL = "https://expense-tracker-api.smithy.dev";
const LOCAL_API_URL = "http://localhost:3520";

const API_URL = PRODUCTION_API_URL;

export function createInstance(authToken: string) {
  http = axios.create({
    baseURL: API_URL,
    headers: { Authorization: authToken },
  });

  http.interceptors.response.use(undefined, (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        const appStore = useAppStore();
        appStore.logout();
        return;
      }
    }

    throw error;
  });
}

export async function login({ email, password }: { email: string; password: string }) {
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
  const { data } = await http!.get<GetTripDataResponse>(`/trips/${tripId}/data`);

  return data;
}

export async function getTripForEditing(tripId: number) {
  const { data } = await http!.get<GetTripEditDataResponse>(`/trips/${tripId}/edit-data`);

  return data;
}

export async function getExpensesForTrip(tripId: number) {
  const { data } = await http!.get<GetExpensesForTripResponse>(`/trips/${tripId}/expenses`);

  return data;
}

export async function getTripStats(
  tripId: number,
  { includeFlights, includeHotels }: { includeFlights: boolean; includeHotels: boolean },
) {
  const { data } = await http!.get<GetTripStatsResponse>(
    `/trips/${tripId}/stats?includeFlights=${includeFlights}&includeHotels=${includeHotels}`,
  );

  return data;
}

export async function addExpenseToTrip(tripId: number, expense: AddExpenseForTripBody) {
  await http!.post(`/trips/${tripId}/expense`, {
    ...expense,
  });
}

export async function editExpenseForTrip(
  tripId: number,
  expenseId: number,
  expenseData: EditExpenseForTripBody,
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
  const { data } = await http!.get<LoadCitiesForCountryResponse>(`/countries/${countryId}/cities`);

  return data.cities;
}

export async function loadUsers() {
  const { data } = await http!.get<LoadUsersResponse>("/users");

  return data.users;
}

export async function uploadFile(file: File) {
  const appStore = useAppStore();

  const formData = new FormData();
  formData.append("image", file);

  // We always want to hit the production API URL for file uploads
  const { data } = await axios.post<UploadFileResponse>(
    `${PRODUCTION_API_URL}/files/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `appStore.authToken`,
      },
    },
  );

  return data.file;
}

export async function createTrip(payload: CreateTripPayload) {
  // Note if running locally and after uploading a file, this route
  // will fail if hitting a local API as files are always uploaded via prod
  const { data } = await http!.post<CreateTripResponse>("/trips", payload);

  return data.trip;
}

export async function updateTrip(tripId: number, payload: Partial<CreateTripPayload>) {
  // Note if running locally and after uploading a file, this route
  // will fail if hitting a local API as files are always uploaded via prod
  const { data } = await http!.patch<CreateTripResponse>(`/trips/${tripId}`, payload);

  return data.trip;
}

export async function deleteTrip(tripId: number) {
  return http!.delete(`/trips/${tripId}`);
}

export interface LoginUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginToken {
  expiry: string;
  token: string;
}

export interface LoginResponse {
  user: LoginUser;
  token: LoginToken;
}

export interface Trip {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: "active" | "deleted";
  image: string;
  totalLocalAmount: number;
  totalExpenseAmount: number;
}

export interface GetTripsResponse {
  trips: Trip[];
}

export interface ExpenseCurrency {
  id: number;
  code: string;
  name: string;
}

export interface ExpenseCategory {
  id: number;
  name: string;
}

export interface ExpenseCity {
  id: number;
  name: string;
  timezone: string;
}

export interface Country {
  id: number;
  name: string;
}

export interface ExpenseUser {
  id: number;
  firstName: string;
  lastName: string;
}

export type TripUser = ExpenseUser;

export interface TripExpense {
  id: number;
  amount: string;
  currency: ExpenseCurrency;
  euroAmount: string;
  localDateTime: string;
  description: string;
  category: ExpenseCategory;
  city: ExpenseCity;
  country: Country;
  user: ExpenseUser;
  createdAt: string;
  updatedAt: string;
}

export interface GetExpensesForTripResponse {
  expenses: TripExpense[];
}

export interface Country {
  id: number;
  name: string;
  currencyCode: string;
  currencyId: number;
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

export interface ExpenseCategory {
  id: number;
  name: string;
}

export interface AddExpenseForTripBody {
  localDateTime: string;
  cityId: number;
  amount: number;
  currencyId: number;
  categoryId: number;
  description: string;
  userId?: number;
  userIds?: number[];
}

export type EditExpenseForTripBody = Partial<AddExpenseForTripBody>;

export interface GetTripDataResponse {
  expenses: TripExpense[];
  trip: Trip;
  countries: Country[];
  cities: City[];
  currencies: Currency[];
  categories: ExpenseCategory[];
  users: Record<string, { firstName: string; lastName: string }>;
}

export interface CountryWithCities {
  name: string;
  countryId: number;
  cityIds?: number[];
}

export interface GetTripEditDataResponse {
  image: Nullable<string>;
  name: string;
  startDate: string;
  endDate: string;
  countries: CountryWithCities[];
  userIds: number[];
}

export interface CategoryBreakdownResult {
  categoryName: string;
  totalEuroAmount: number;
}

export interface UserBreakdownResult {
  userFirstName: string;
  totalEuroAmount: number;
}

export interface ExpensiveTripDayResult {
  localDate: string;
  totalEuroAmount: number;
}

export interface CountryBreakdownResult {
  name: string;
  euroTotal: number;
  localTotal: number;
  localCurrency: string;
}

export interface CityBreakdownResult extends Omit<CountryBreakdownResult, "localTotal"> {
  localAmount: number;
}

export interface DailyCostBreakdownResult {
  localDate: string;
  euroTotal: number;
}

export interface HourlySpendingResult {
  hour: string;
  total: number;
}

export interface GetTripStatsResponse {
  categoryBreakdown: CategoryBreakdownResult[];
  userBreakdown: UserBreakdownResult[];
  mostExpenseDay: ExpensiveTripDayResult;
  leastExpensiveDay: ExpensiveTripDayResult;
  countryBreakdown: CountryBreakdownResult[];
  cityBreakdown: CityBreakdownResult[];
  dailyCostBreakdown: DailyCostBreakdownResult[];
  hourlySpendingBreakdown: HourlySpendingResult[];
}

export interface LoadCountriesResponse {
  countries: Country[];
}

export type CityForCountry = Omit<City, "timezoneName">;

export interface LoadCitiesForCountryResponse {
  cities: CityForCountry[];
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export interface LoadUsersResponse {
  users: User[];
}

export interface UploadFileResponse {
  file: string;
}

export interface CreateTripCountry {
  countryId: number;
  cityIds?: number[];
}

export interface CreateTripPayload {
  name: string;
  startDate: string;
  endDate: string;
  file?: string;
  countries: CreateTripCountry[];
  userIds: number[];
}

export interface CreateTripResponse {
  trip: Trip;
}

export type UpdateTripPayload = Partial<CreateTripPayload>;
