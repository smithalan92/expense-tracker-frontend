const LOCALSTORAGE_BASE_KEY = "expense-tracker-v1";

export const LOCALSTORAGE_AUTH_KEY = "auth";
export const LOCALSTORAGE_TRIPS_KEY = "trips";
export const LOCALSTORAGE_CURRENCIES_KEY = "currencies";
export const LOCALSTORAGE_EXPENSE_CATEGORIES_KEY = "expense-categories";

export function getTripExpensesKey(tripId: number) {
  return `trip-expenses-${tripId}`;
}

export function getTripCountriesKey(tripId: number) {
  return `trip-countries-${tripId}`;
}

export function getCountriesCitiesKey(countryIds: number[]) {
  return `country-${countryIds.join("-")}-cities`;
}

export function getUnsavedExpensesForTripKey(tripId: number) {
  return `trip-expenses-unsaved-${tripId}`;
}

export function setStorageItem(key: string, data: unknown) {
  const parsedData = JSON.stringify(data);

  localStorage.setItem(`${LOCALSTORAGE_BASE_KEY}-${key}`, parsedData);
}

export function getStorageItem<T = unknown>(key: string): T | null {
  const data = localStorage.getItem(`${LOCALSTORAGE_BASE_KEY}-${key}`);

  return data ? (JSON.parse(data) as T) : null;
}

export function deleteStorageItem(key: string) {
  localStorage.removeItem(`${LOCALSTORAGE_BASE_KEY}-${key}`);
}
