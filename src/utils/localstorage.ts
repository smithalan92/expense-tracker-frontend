import type { TripDataState } from "@/stores/tripDataStore";
import destr from "destr";

export const BASE_LOCALSTORAGE_KEY = "expense-tracker-v3";

const TRIP_DATA_KEY = "tripData";

export function writeToLocalStorage(key: string, value: string) {
  localStorage.setItem(`${BASE_LOCALSTORAGE_KEY}__${key}`, value);
}

export function writeTripDataToLocalStorage(state: TripDataState) {
  if (!state.trip.id) return;

  const dataToStore: SavedTripData = {
    trip: state.trip,
    expenses: state.expenses,
    unsavedExpenses: state.unsavedExpenses,
    countries: state.countries,
    cities: state.cities,
    currencies: state.currencies,
    categories: state.categories,
    users: state.users,
  };

  writeToLocalStorage(`${TRIP_DATA_KEY}__${dataToStore.trip.id}`, JSON.stringify(dataToStore));
}

export function getFromLocalStorage<T>(key: string) {
  const value = localStorage.getItem(`${BASE_LOCALSTORAGE_KEY}__${key}`);

  return destr<Nullable<T>>(value);
}

export function getTripFromLocalStorage(tripId: number) {
  return getFromLocalStorage<SavedTripData>(`${TRIP_DATA_KEY}__${tripId}`);
}

type SavedTripData = Omit<TripDataState, "isLoadingTripData" | "hasFailedToLoadTripData">;
