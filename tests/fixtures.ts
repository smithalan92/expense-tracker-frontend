import type { TripDataState } from "@/stores/tripDataStore";
import type { Trip } from "@/api/trip";
import type { TripExpense } from "@/api/expense";

export const mockTrip: Trip = {
  id: 1,
  name: "Japan Trip",
  startDate: "2024-03-01",
  endDate: "2024-03-15",
  image: "",
  totalExpenseAmount: 500,
};

export const mockExpense: TripExpense = {
  id: 10,
  amount: "50.00",
  currency: { id: 1, code: "EUR", name: "Euro" },
  euroAmount: "50.00",
  localDateTime: "2024-03-05T10:00:00",
  description: "Lunch",
  category: { id: 2, name: "Food" },
  city: { id: 3, name: "Tokyo", timezone: "Asia/Tokyo" },
  country: { id: 4, name: "Japan" },
  users: [{ id: 1, firstName: "Alan", lastName: "Smith" }],
  createdAt: "2024-03-05T10:00:00Z",
  updatedAt: "2024-03-05T10:00:00Z",
};

export const mockTripDataState: Omit<TripDataState, "isLoadingTripData" | "hasFailedToLoadTripData"> = {
  trip: mockTrip,
  expenses: [mockExpense],
  unsavedExpenses: [],
  countries: [
    {
      id: 4,
      name: "Japan",
      currencyId: 1,
      cities: [{ id: 3, name: "Tokyo" }],
    },
  ],
  currencyIds: [1],
  categories: [{ id: 2, name: "Food" }],
  userIds: [1],
};

export function makeNetworkError() {
  const err = new Error("Network Error") as any;
  err.isAxiosError = true;
  err.code = "ERR_NETWORK";
  return err;
}
