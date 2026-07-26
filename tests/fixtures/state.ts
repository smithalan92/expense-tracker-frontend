import type { TripDataState } from "@/store/tripDataStore";
import { IRELAND_FOR_TRIP } from "./countries_cities";
import { EURO_MOCK_EXPENSE_ONE } from "./expenses";
import { TESTING_TRIP } from "./trip";

export const MOCK_TRIP_DATA_STATE: Omit<TripDataState, "isLoadingTripData" | "hasFailedToLoadTripData"> = {
  trip: TESTING_TRIP,
  expenses: [EURO_MOCK_EXPENSE_ONE],
  unsavedExpenses: [],
  countries: [IRELAND_FOR_TRIP],
  currencyIds: [1],
  categories: [{ id: 4, name: "Restaurants" }],
  userIds: [1],
  filters: {
    search: "",
    filterByUserId: null,
    filterByCategoryId: null,
  },
};
