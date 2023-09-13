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
}

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
}

export type EditExpenseForTripBody = Partial<AddExpenseForTripBody>;

export interface GetTripDataResponse {
  expenses: TripExpense[];
  trip: Trip;
  countries: Country[];
  cities: City[];
  currencies: Currency[];
  categories: ExpenseCategory[];
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

export interface CityBreakdownResult
  extends Omit<CountryBreakdownResult, "localTotal"> {
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

export interface LoadCitiesForCountryResponse {
  cities: Omit<City, "timezoneName">[];
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
