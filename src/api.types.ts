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

export interface TripExpense {
  id: number;
  name: string;
  amount: number;
  euroAmount: number;
  currencyCode: string;
  date: string;
  description: string;
  categoryId: number;
  categoryName: string;
}

export interface GetExpensesForTripResponse {
  trip: Trip;
  expenses: TripExpense[];
}

export interface CountryForTrip {
  id: number;
  name: string;
}

export interface GetCountriesForTripResponse {
  countries: CountryForTrip[];
}

export interface City {
  id: number;
  name: string;
}

export interface GetCitiesForCountryResponse {
  cities: City[];
}
