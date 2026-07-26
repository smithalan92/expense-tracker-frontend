import { BASE_LOCALSTORAGE_KEY } from "@/utils/localstorage";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RESTAURANTS, SNACKS_DRINKS } from "../fixtures/categories";
import { IRELAND_FOR_TRIP } from "../fixtures/countries_cities";
import { AED_MOCK_EXPENSE_ONE, EURO_MOCK_EXPENSE_ONE } from "../fixtures/expenses";
import { makeNetworkError } from "../fixtures/network";
import { MOCK_TRIP_DATA_STATE } from "../fixtures/state";
import { TESTING_TRIP } from "../fixtures/trip";
import { USER_ONE, USER_TWO } from "../fixtures/users";

// --- module mocks ---
vi.mock("@/api/trip", () => ({
  getTripData: vi.fn(),
  updateTrip: vi.fn(),
}));

vi.mock("@/api/expense", () => ({
  addExpensesToTrip: vi.fn(),
  deleteExpense: vi.fn(),
  updateExpense: vi.fn(),
}));

// Partial mock: updateTrip does `err instanceof FileUploadError`, so the real
// class has to survive or the check throws instead of matching.
vi.mock("@/api/file", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/api/file")>()),
  uploadFile: vi.fn(),
}));

const mockTripsStorePatch = vi.fn();
vi.mock("@/store/tripsStore", () => ({
  default: vi.fn(() => ({
    trips: [TESTING_TRIP],
    $patch: mockTripsStorePatch,
  })),
}));

vi.mock("@/store/appStore", () => ({
  default: vi.fn(() => ({
    currencies: [{ id: 1, code: "EUR", name: "Euro" }],
    users: [
      { id: 1, firstName: "Alan", lastName: "Smith" },
      { id: 2, firstName: "Jane", lastName: "Doe" },
    ],
  })),
}));

import { addExpensesToTrip, deleteExpense, updateExpense } from "@/api/expense";
import { uploadFile } from "@/api/file";
import { getTripData, updateTrip } from "@/api/trip";
import useTripDataStore from "@/store/tripDataStore";

const TRIP_ID = 1;
const STORAGE_KEY = `${BASE_LOCALSTORAGE_KEY}__tripData__${TRIP_ID}`;

function seedLocalStorage(overrides = {}) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...MOCK_TRIP_DATA_STATE, ...overrides }));
}

const BASE_PAYLOAD = {
  localDateTime: "2024-03-05T10:00:00",
  countryId: IRELAND_FOR_TRIP.id,
  cityId: IRELAND_FOR_TRIP.cities[0].id,
  amount: 25,
  currencyId: 1,
  categoryId: 4,
  description: "Coffee",
  userIds: [1],
};

describe("tripDataStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.resetAllMocks();
    mockTripsStorePatch.mockReset();
  });

  describe("getters", () => {
    describe("getExpenses", () => {
      it("returns saved and unsaved expenses combined", () => {
        const store = useTripDataStore();
        store.$patch({
          expenses: [EURO_MOCK_EXPENSE_ONE],
          unsavedExpenses: [{ ...AED_MOCK_EXPENSE_ONE, id: -1 }],
        });

        expect(store.getExpenses).toHaveLength(2);
      });

      it("filters by search term on description", () => {
        const store = useTripDataStore();
        store.$patch({
          expenses: [EURO_MOCK_EXPENSE_ONE, AED_MOCK_EXPENSE_ONE],
          filters: { search: "EURO", filterByUserId: null, filterByCategoryId: null },
        });

        const results = store.getExpenses;
        expect(results).toHaveLength(1);
        expect(results[0]!.description).toContain("EURO");
      });

      it("filters by userId", () => {
        const store = useTripDataStore();
        store.$patch({
          expenses: [EURO_MOCK_EXPENSE_ONE, AED_MOCK_EXPENSE_ONE],
          filters: { search: "", filterByUserId: USER_TWO.id, filterByCategoryId: null },
        });

        const results = store.getExpenses;
        expect(results).toHaveLength(1);
        expect(results[0]!.id).toBe(AED_MOCK_EXPENSE_ONE.id);
      });

      it("filters by categoryId", () => {
        const store = useTripDataStore();
        store.$patch({
          expenses: [EURO_MOCK_EXPENSE_ONE, AED_MOCK_EXPENSE_ONE],
          filters: { search: "", filterByUserId: null, filterByCategoryId: SNACKS_DRINKS.id },
        });

        const results = store.getExpenses;
        expect(results).toHaveLength(1);
        expect(results[0]!.id).toBe(AED_MOCK_EXPENSE_ONE.id);
      });

      it("applies multiple filters together", () => {
        const store = useTripDataStore();
        store.$patch({
          expenses: [EURO_MOCK_EXPENSE_ONE, AED_MOCK_EXPENSE_ONE],
          filters: { search: "AED", filterByUserId: USER_ONE.id, filterByCategoryId: SNACKS_DRINKS.id },
        });

        expect(store.getExpenses).toHaveLength(1);
      });

      it("returns all expenses when no filters are set", () => {
        const store = useTripDataStore();
        store.$patch({
          expenses: [EURO_MOCK_EXPENSE_ONE, AED_MOCK_EXPENSE_ONE],
          filters: { search: "", filterByUserId: null, filterByCategoryId: null },
        });

        expect(store.getExpenses).toHaveLength(2);
      });
    });

    describe("hasUnsavedExpenses", () => {
      it("returns false when there are no unsaved expenses", () => {
        const store = useTripDataStore();
        store.$patch({ unsavedExpenses: [] });
        expect(store.hasUnsavedExpenses).toBe(false);
      });

      it("returns true when there are unsaved expenses", () => {
        const store = useTripDataStore();
        store.$patch({ unsavedExpenses: [{ ...EURO_MOCK_EXPENSE_ONE, id: -1 }] });
        expect(store.hasUnsavedExpenses).toBe(true);
      });
    });

    describe("totalExpenseAmount", () => {
      it("sums euroAmount across all saved and unsaved expenses", () => {
        const store = useTripDataStore();
        // EURO_MOCK_EXPENSE_ONE euroAmount = "10.00", AED_MOCK_EXPENSE_ONE euroAmount = "4.00"
        store.$patch({
          expenses: [EURO_MOCK_EXPENSE_ONE],
          unsavedExpenses: [{ ...AED_MOCK_EXPENSE_ONE, id: -1 }],
        });

        expect(store.totalExpenseAmount).toBe("€14.00");
      });

      it("returns €0.00 when there are no expenses", () => {
        const store = useTripDataStore();
        expect(store.totalExpenseAmount).toBe("€0.00");
      });
    });

    describe("areAnyFiltersActive", () => {
      it("returns false when no filters are set", () => {
        const store = useTripDataStore();
        expect(store.areAnyFiltersActive).toBe(false);
      });

      it("returns true when search is set", () => {
        const store = useTripDataStore();
        store.$patch({ filters: { search: "coffee", filterByUserId: null, filterByCategoryId: null } });
        expect(store.areAnyFiltersActive).toBe(true);
      });

      it("returns true when filterByUserId is set", () => {
        const store = useTripDataStore();
        store.$patch({ filters: { search: "", filterByUserId: 1, filterByCategoryId: null } });
        expect(store.areAnyFiltersActive).toBe(true);
      });

      it("returns true when filterByCategoryId is set", () => {
        const store = useTripDataStore();
        store.$patch({ filters: { search: "", filterByUserId: null, filterByCategoryId: 2 } });
        expect(store.areAnyFiltersActive).toBe(true);
      });

      it("returns false for whitespace-only search", () => {
        const store = useTripDataStore();
        store.$patch({ filters: { search: "   ", filterByUserId: null, filterByCategoryId: null } });
        expect(store.areAnyFiltersActive).toBe(false);
      });
    });
  });

  describe("actions", () => {
    describe("restoreStateFromLocalStorage", () => {
      it("should restore the trip state from local storage if available", () => {
        seedLocalStorage();

        const store = useTripDataStore();

        store._restoreStateFromLocalStorage(TRIP_ID);

        expect(store.trip.name).toBe(TESTING_TRIP.name);
        expect(store.expenses).toHaveLength(1);
        expect(store.hasFailedToLoadTripData).toBe(false);
      });

      it("should throw an error if local trip state is unavailable", () => {
        const store = useTripDataStore();

        expect(() => store._restoreStateFromLocalStorage(TRIP_ID)).toThrow(
          "failed to retrieve from local storage",
        );
      });
    });

    describe("_restoreUnsavedExpensesFromLocalStorage", () => {
      it("restores unsaved expenses when cached state has them", () => {
        seedLocalStorage({ unsavedExpenses: [{ ...EURO_MOCK_EXPENSE_ONE, id: -1 }] });

        const store = useTripDataStore();

        expect(store.unsavedExpenses).toEqual([]);

        store._restoreUnsavedExpensesFromLocalStorage(TRIP_ID);

        expect(store.unsavedExpenses).toHaveLength(1);
        expect(store.unsavedExpenses[0]!.id).toBe(-1);
      });

      it("does nothing when there are no unsaved expenses in cache", () => {
        seedLocalStorage({ unsavedExpenses: [] });

        const store = useTripDataStore();
        store._restoreUnsavedExpensesFromLocalStorage(TRIP_ID);

        expect(store.unsavedExpenses).toHaveLength(0);
      });

      it("does nothing when there is no cached state at all", () => {
        const store = useTripDataStore();
        store._restoreUnsavedExpensesFromLocalStorage(TRIP_ID);

        expect(store.unsavedExpenses).toHaveLength(0);
      });
    });

    describe("loadTripData", () => {
      describe("success", () => {
        it("populates all state fields from the API response", async () => {
          vi.mocked(getTripData).mockResolvedValue({
            trip: TESTING_TRIP,
            expenses: [EURO_MOCK_EXPENSE_ONE],
            countries: [IRELAND_FOR_TRIP],
            currencyIds: [1],
            categories: [RESTAURANTS],
            userIds: [1],
          });

          const store = useTripDataStore();

          vi.spyOn(store, "_restoreUnsavedExpensesFromLocalStorage");

          await store.loadTripData(TRIP_ID);

          expect(store.trip).toEqual(TESTING_TRIP);
          expect(store.expenses).toHaveLength(1);
          expect(store.countries).toEqual([IRELAND_FOR_TRIP]);
          expect(store.currencyIds).toEqual([1]);
          expect(store.categories).toEqual([RESTAURANTS]);
          expect(store.userIds).toEqual([1]);

          expect(store._restoreUnsavedExpensesFromLocalStorage).toHaveBeenCalledWith(TRIP_ID);
        });

        it("sets isLoadingTripData to false after load", async () => {
          vi.mocked(getTripData).mockResolvedValue({
            trip: TESTING_TRIP,
            expenses: [],
            countries: [],
            currencyIds: [],
            categories: [],
            userIds: [],
          });

          const store = useTripDataStore();
          await store.loadTripData(TRIP_ID);

          expect(store.isLoadingTripData).toBe(false);
        });

        it("leaves hasFailedToLoadTripData as false", async () => {
          vi.mocked(getTripData).mockResolvedValue({
            trip: TESTING_TRIP,
            expenses: [],
            countries: [],
            currencyIds: [],
            categories: [],
            userIds: [],
          });

          const store = useTripDataStore();
          await store.loadTripData(TRIP_ID);

          expect(store.hasFailedToLoadTripData).toBe(false);
        });
      });

      describe("offline fallback", () => {
        it("restores state from localStorage when a network error occurs", async () => {
          seedLocalStorage();
          vi.mocked(getTripData).mockRejectedValue(makeNetworkError());

          const store = useTripDataStore();

          vi.spyOn(store, "_restoreStateFromLocalStorage");

          await expect(store.loadTripData(TRIP_ID)).rejects.toThrow();

          expect(store._restoreStateFromLocalStorage).toHaveBeenCalledWith(TRIP_ID);

          expect(store.trip.name).toBe(TESTING_TRIP.name);
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
      });
    });

    describe("updateTrip", () => {
      const TRIP_PAYLOAD = {
        name: "Updated Trip",
        startDate: "2024-01-01",
        endDate: "2024-01-10",
        countries: [],
        userIds: [1],
      };

      it("patches the store with the API response", async () => {
        const updatedTrip = { ...TESTING_TRIP, name: "Updated Trip" };
        vi.mocked(updateTrip).mockResolvedValue({
          trip: updatedTrip,
          countries: [IRELAND_FOR_TRIP],
          currencyIds: [1],
          userIds: [1],
        });

        const store = useTripDataStore();
        store.$patch(MOCK_TRIP_DATA_STATE);

        await store.updateTrip({ tripId: TRIP_ID, payload: TRIP_PAYLOAD });

        expect(store.trip.name).toBe("Updated Trip");
        expect(store.countries).toEqual([IRELAND_FOR_TRIP]);
      });

      it("uploads file and includes URL in payload before updating", async () => {
        vi.mocked(uploadFile).mockResolvedValue("https://cdn.example.com/image.jpg");
        vi.mocked(updateTrip).mockResolvedValue({
          trip: TESTING_TRIP,
          countries: [],
          currencyIds: [],
          userIds: [],
        });

        const store = useTripDataStore();
        const file = new File(["img"], "photo.jpg", { type: "image/jpeg" });

        await store.updateTrip({ tripId: TRIP_ID, payload: { ...TRIP_PAYLOAD }, file });

        expect(uploadFile).toHaveBeenCalledWith(file);
        expect(updateTrip).toHaveBeenCalledWith(
          TRIP_ID,
          expect.objectContaining({ file: "https://cdn.example.com/image.jpg" }),
        );
      });

      it("throws when file upload fails", async () => {
        vi.mocked(uploadFile).mockRejectedValue(new Error("Upload failed"));

        const store = useTripDataStore();
        const file = new File(["img"], "photo.jpg", { type: "image/jpeg" });

        await expect(store.updateTrip({ tripId: TRIP_ID, payload: TRIP_PAYLOAD, file })).rejects.toThrow(
          "Failed to save file",
        );

        expect(updateTrip).not.toHaveBeenCalled();
      });

      it("updates the matching trip in the trips store", async () => {
        const updatedTrip = { ...TESTING_TRIP, name: "Updated Trip" };
        vi.mocked(updateTrip).mockResolvedValue({
          trip: updatedTrip,
          countries: [],
          currencyIds: [],
          userIds: [],
        });

        const store = useTripDataStore();
        store.$patch(MOCK_TRIP_DATA_STATE);

        await store.updateTrip({ tripId: TRIP_ID, payload: TRIP_PAYLOAD });

        expect(mockTripsStorePatch).toHaveBeenCalledWith(
          expect.objectContaining({
            trips: expect.arrayContaining([expect.objectContaining({ name: "Updated Trip" })]),
          }),
        );
      });
    });

    describe("addExpense", () => {
      describe("success", () => {
        it("appends the returned expense to the expenses list", async () => {
          const newExpense = { ...EURO_MOCK_EXPENSE_ONE, id: 99 };
          vi.mocked(addExpensesToTrip).mockResolvedValue({ data: { expenses: [newExpense] } } as any);

          const store = useTripDataStore();
          store.$patch({ ...MOCK_TRIP_DATA_STATE, expenses: [] });

          await store.addExpense({ payload: BASE_PAYLOAD });

          expect(store.expenses).toHaveLength(1);
          expect(store.expenses[0]!.id).toBe(99);
        });

        it("calls the API with the correct trip ID and payload", async () => {
          vi.mocked(addExpensesToTrip).mockResolvedValue({ data: { expenses: [] } } as any);

          const store = useTripDataStore();
          store.$patch({ ...MOCK_TRIP_DATA_STATE, expenses: [] });

          await store.addExpense({ payload: BASE_PAYLOAD });

          expect(addExpensesToTrip).toHaveBeenCalledWith(TESTING_TRIP.id, [BASE_PAYLOAD]);
        });
      });

      describe("offline fallback", () => {
        it("stores expense locally when a network error occurs", async () => {
          vi.mocked(addExpensesToTrip).mockRejectedValue(makeNetworkError());

          const store = useTripDataStore();

          vi.spyOn(store, "_addUnsavedExpense").mockImplementation(() => {});

          store.$patch(MOCK_TRIP_DATA_STATE);

          await store.addExpense({ payload: BASE_PAYLOAD });

          expect(store._addUnsavedExpense).toHaveBeenCalledWith({ payload: BASE_PAYLOAD });
        });

        it("re-throws non-network errors", async () => {
          vi.mocked(addExpensesToTrip).mockRejectedValue(new Error("Server error"));

          const store = useTripDataStore();
          store.$patch({ ...MOCK_TRIP_DATA_STATE, unsavedExpenses: [] });

          await expect(store.addExpense({ payload: BASE_PAYLOAD })).rejects.toThrow("Server error");

          expect(store.unsavedExpenses).toHaveLength(0);
        });
      });
    });

    describe("_addUnsavedExpense", () => {
      it("should add an unsaved expense", () => {
        const store = useTripDataStore();

        store.$patch(MOCK_TRIP_DATA_STATE);

        store._addUnsavedExpense({ payload: BASE_PAYLOAD });

        expect(store.unsavedExpenses).toHaveLength(1);
        expect(store.unsavedExpenses[0]!.description).toBe("Coffee");
        expect(store.unsavedExpenses[0]!.id).toBeLessThan(0);
      });
    });

    describe("syncUnsavedExpenses", () => {
      it("moves unsaved expenses to the saved list on success", async () => {
        const savedExpense = { ...EURO_MOCK_EXPENSE_ONE, id: 99 };
        vi.mocked(addExpensesToTrip).mockResolvedValue({ data: { expenses: [savedExpense] } } as any);

        const store = useTripDataStore();
        store.$patch({
          ...MOCK_TRIP_DATA_STATE,
          unsavedExpenses: [{ ...EURO_MOCK_EXPENSE_ONE, id: -1 }],
        });

        await store.syncUnsavedExpenses();

        expect(store.unsavedExpenses).toHaveLength(0);
        expect(store.expenses.find((e) => e.id === 99)).toBeDefined();
      });

      it("does nothing when there are no unsaved expenses", async () => {
        const store = useTripDataStore();
        store.$patch({ ...MOCK_TRIP_DATA_STATE, unsavedExpenses: [] });

        await store.syncUnsavedExpenses();

        expect(addExpensesToTrip).not.toHaveBeenCalled();
      });
    });

    describe("updateExpense", () => {
      describe("positive ID (saved expense)", () => {
        it("updates the expense in state with the API response", async () => {
          const updatedExpense = { ...EURO_MOCK_EXPENSE_ONE, description: "Updated description" };
          vi.mocked(updateExpense).mockResolvedValue({ expense: updatedExpense });

          const store = useTripDataStore();
          store.$patch({ ...MOCK_TRIP_DATA_STATE, expenses: [{ ...EURO_MOCK_EXPENSE_ONE }] });

          await store.updateExpense({
            expenseId: EURO_MOCK_EXPENSE_ONE.id,
            payload: { ...BASE_PAYLOAD, description: "Updated description" },
          });

          expect(store.expenses[0]!.description).toBe("Updated description");
        });

        it("throws when the expense to update is not found", async () => {
          const store = useTripDataStore();
          store.$patch({ ...MOCK_TRIP_DATA_STATE, expenses: [] });

          await expect(store.updateExpense({ expenseId: 999, payload: BASE_PAYLOAD })).rejects.toThrow(
            "Could not find expense",
          );
        });
      });

      describe("negative ID (unsaved expense)", () => {
        it("updates the matching unsaved expense without hitting the API", async () => {
          const store = useTripDataStore();

          vi.spyOn(store, "_updateUnsavedExpense");

          store.$patch({
            ...MOCK_TRIP_DATA_STATE,
            unsavedExpenses: [{ ...EURO_MOCK_EXPENSE_ONE, id: -1, description: "Old" }],
          });

          const payload = {
            localDateTime: EURO_MOCK_EXPENSE_ONE.localDateTime,
            countryId: IRELAND_FOR_TRIP.id,
            cityId: IRELAND_FOR_TRIP.cities[0].id,
            amount: 10,
            currencyId: 1,
            categoryId: 4,
            description: "New description",
            userIds: [1],
          };

          await store.updateExpense({
            expenseId: -1,
            payload,
          });

          expect(updateExpense).not.toHaveBeenCalled();
          expect(store._updateUnsavedExpense).toHaveBeenCalledWith({
            expenseId: -1,
            payload,
          });
        });
      });
    });

    describe("_updateUnsavedExpense", () => {
      it("should update an unsaved expense", () => {
        const store = useTripDataStore();
        store.$patch({
          ...MOCK_TRIP_DATA_STATE,
          unsavedExpenses: [{ ...EURO_MOCK_EXPENSE_ONE, id: -1, description: "Old" }],
        });

        store._updateUnsavedExpense({
          expenseId: -1,
          payload: {
            localDateTime: EURO_MOCK_EXPENSE_ONE.localDateTime,
            countryId: IRELAND_FOR_TRIP.id,
            cityId: IRELAND_FOR_TRIP.cities[0].id,
            amount: 10,
            currencyId: 1,
            categoryId: 4,
            description: "New description",
            userIds: [1],
          },
        });

        expect(store.unsavedExpenses[0]!.description).toBe("New description");
      });
    });

    describe("deleteExpense", () => {
      describe("positive ID (saved expense)", () => {
        it("calls the API and removes the expense from state", async () => {
          vi.mocked(deleteExpense).mockResolvedValue({} as any);

          const store = useTripDataStore();
          store.$patch({ ...MOCK_TRIP_DATA_STATE, expenses: [EURO_MOCK_EXPENSE_ONE] });

          await store.deleteExpense(EURO_MOCK_EXPENSE_ONE.id);

          expect(deleteExpense).toHaveBeenCalledWith(EURO_MOCK_EXPENSE_ONE.id);
          expect(store.expenses).toHaveLength(0);
        });

        it("throws when the expense ID is not found", async () => {
          const store = useTripDataStore();
          store.$patch({ ...MOCK_TRIP_DATA_STATE, expenses: [] });

          await expect(store.deleteExpense(999)).rejects.toThrow("Could not find expense to delete");
          expect(deleteExpense).not.toHaveBeenCalled();
        });
      });

      describe("negative ID (unsaved expense)", () => {
        it("removes an unsaved expense without hitting the API", async () => {
          const store = useTripDataStore();
          store.$patch({
            ...MOCK_TRIP_DATA_STATE,
            unsavedExpenses: [{ ...EURO_MOCK_EXPENSE_ONE, id: -42 }],
          });

          await store.deleteExpense(-42);

          expect(store.unsavedExpenses).toHaveLength(0);
          expect(deleteExpense).not.toHaveBeenCalled();
        });

        it("throws when the unsaved expense ID is not found", async () => {
          const store = useTripDataStore();
          store.$patch({ ...MOCK_TRIP_DATA_STATE, unsavedExpenses: [] });

          await expect(store.deleteExpense(-99)).rejects.toThrow("Could not find expense to delete");
        });
      });
    });

    describe("clearFilters", () => {
      it("resets all filters to their defaults", () => {
        const store = useTripDataStore();
        store.$patch({
          filters: { search: "coffee", filterByUserId: 1, filterByCategoryId: 2 },
        });

        store.clearFilters();

        expect(store.filters.search).toBe("");
        expect(store.filters.filterByUserId).toBeNull();
        expect(store.filters.filterByCategoryId).toBeNull();
      });
    });

    describe("resetState", () => {
      it("clears all state back to defaults", () => {
        const store = useTripDataStore();
        store.$patch({ ...MOCK_TRIP_DATA_STATE, expenses: [EURO_MOCK_EXPENSE_ONE] });

        store.resetState();

        expect(store.expenses).toHaveLength(0);
        expect(store.trip.id).toBe(0);
        expect(store.trip.name).toBe("");
      });
    });
  });
});
