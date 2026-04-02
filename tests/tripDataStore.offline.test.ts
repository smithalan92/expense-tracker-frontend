import { BASE_LOCALSTORAGE_KEY } from "@/utils/localstorage";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeNetworkError, mockExpense, mockTrip, mockTripDataState } from "./fixtures";

// --- module mocks ---
vi.mock("@/api/trip", () => ({
  getTripData: vi.fn(),
}));

vi.mock("@/api/expense", () => ({
  addExpensesToTrip: vi.fn(),
}));

vi.mock("@/stores/appStore", () => ({
  default: vi.fn(() => ({
    currencies: [{ id: 1, code: "EUR", name: "Euro" }],
    users: [{ id: 1, firstName: "Alan", lastName: "Smith" }],
  })),
}));

import { addExpensesToTrip } from "@/api/expense";
import { getTripData } from "@/api/trip";
import useTripDataStore from "@/stores/tripDataStore";

const TRIP_ID = 1;
const STORAGE_KEY = `${BASE_LOCALSTORAGE_KEY}__tripData__${TRIP_ID}`;

function seedLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTripDataState));
}

describe("tripDataStore - Offline handling", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.resetAllMocks();
  });

  describe("loadTripData — offline fallback", () => {
    it("restores state from localStorage when a network error occurs", async () => {
      seedLocalStorage();
      vi.mocked(getTripData).mockRejectedValue(makeNetworkError());

      const store = useTripDataStore();

      await expect(store.loadTripData(TRIP_ID)).rejects.toThrow();

      expect(store.trip.name).toBe(mockTrip.name);
      expect(store.expenses).toHaveLength(1);
      expect(store.hasFailedToLoadTripData).toBe(false);
    });

    it("sets hasFailedToLoadTripData when offline with no cached data", async () => {
      vi.mocked(getTripData).mockRejectedValue(makeNetworkError());

      const store = useTripDataStore();

      await expect(store.loadTripData(TRIP_ID)).rejects.toThrow();

      expect(store.hasFailedToLoadTripData).toBe(true);
    });

    it("sets hasFailedToLoadTripData for non-network errors", async () => {
      vi.mocked(getTripData).mockRejectedValue(new Error("Server error"));

      const store = useTripDataStore();

      await expect(store.loadTripData(TRIP_ID)).rejects.toThrow();

      expect(store.hasFailedToLoadTripData).toBe(true);
    });

    it("restores unsaved expenses from localStorage after a successful load", async () => {
      const stateWithUnsaved = {
        ...mockTripDataState,
        unsavedExpenses: [{ ...mockExpense, id: -1 }],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateWithUnsaved));

      vi.mocked(getTripData).mockResolvedValue({
        trip: mockTrip,
        expenses: [mockExpense],
        countries: mockTripDataState.countries,
        currencyIds: [1],
        categories: [{ id: 4, name: "Restaurants" }],
        userIds: [1],
      });

      const store = useTripDataStore();
      await store.loadTripData(TRIP_ID);

      expect(store.unsavedExpenses).toHaveLength(1);
      expect(store.unsavedExpenses[0]!.id).toBe(-1);
    });
  });

  describe("addExpense — offline fallback", () => {
    it("stores expense locally when a network error occurs", async () => {
      vi.mocked(addExpensesToTrip).mockRejectedValue(makeNetworkError());

      const store = useTripDataStore();
      store.$patch(mockTripDataState);

      await store.addExpense({
        payload: {
          localDateTime: "2024-03-05T10:00:00",
          countryId: 4,
          cityId: 3,
          amount: 25,
          currencyId: 1,
          categoryId: 4,
          description: "Coffee",
          userIds: [1],
        },
      });

      expect(store.unsavedExpenses).toHaveLength(1);
      expect(store.unsavedExpenses[0]!.description).toBe("Coffee");
      expect(store.unsavedExpenses[0]!.id).toBeLessThan(0);
    });

    it("re-throws non-network errors", async () => {
      vi.mocked(addExpensesToTrip).mockRejectedValue(new Error("Server error"));

      const store = useTripDataStore();
      store.$patch({ ...mockTripDataState, unsavedExpenses: [] });

      await expect(
        store.addExpense({
          payload: {
            localDateTime: "2024-03-05T10:00:00",
            countryId: 4,
            cityId: 3,
            amount: 25,
            currencyId: 1,
            categoryId: 2,
            description: "Coffee",
            userIds: [1],
          },
        }),
      ).rejects.toThrow("Server error");

      expect(store.unsavedExpenses).toHaveLength(0);
    });
  });

  describe("deleteExpense — offline (negative ID)", () => {
    it("removes an unsaved expense by negative ID without hitting the API", async () => {
      const store = useTripDataStore();
      store.$patch({
        ...mockTripDataState,
        unsavedExpenses: [{ ...mockExpense, id: -42 }],
      });

      await store.deleteExpense(-42);

      expect(store.unsavedExpenses).toHaveLength(0);
    });

    it("throws when the unsaved expense ID is not found", async () => {
      const store = useTripDataStore();
      store.$patch({ ...mockTripDataState, unsavedExpenses: [] });

      await expect(store.deleteExpense(-99)).rejects.toThrow("Could not find expense to delete");
    });
  });

  describe("syncUnsavedExpenses", () => {
    it("moves unsaved expenses to the saved list on success", async () => {
      const savedExpense = { ...mockExpense, id: 99 };
      vi.mocked(addExpensesToTrip).mockResolvedValue({
        data: { expenses: [savedExpense] },
      } as any);

      const store = useTripDataStore();
      store.$patch({
        ...mockTripDataState,
        unsavedExpenses: [{ ...mockExpense, id: -1 }],
      });

      await store.syncUnsavedExpenses();

      expect(store.unsavedExpenses).toHaveLength(0);
      expect(store.expenses.find((e) => e.id === 99)).toBeDefined();
    });
  });
});
