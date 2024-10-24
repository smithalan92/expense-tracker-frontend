const LOCALSTORAGE_BASE_KEY = "expense-tracker-v2";

export const LOCALSTORAGE_AUTH_KEY = "auth";
export const LOCALSTORAGE_TRIPS_KEY = "trips";

export function getTripDataKey(tripId: number) {
  return `trip-data-${tripId}`;
}

export function getUnsavedExpensesForTripKey(tripId: number) {
  return `trip-expenses-unsaved-${tripId}`;
}

export function getMobileSelectConfigKey() {
  return "disable-native-selects-on-mobile";
}

export function getExpenseViewConfigKey() {
  return "expense-view";
}

export function getMultiUserExpensePickerKey() {
  return "multi-user-expense-picker";
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

export function deleteAllLocalStorage() {
  localStorage.clear();
}
