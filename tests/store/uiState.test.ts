import useUIStateStore from "@/store/uiState";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { IRELAND_FOR_TRIP } from "../fixtures/countries_cities";
import { EURO_MOCK_EXPENSE_ONE } from "../fixtures/expenses";
import { TESTING_TRIP } from "../fixtures/trip";

describe("uiState store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("actions", () => {
    describe("setIsAddingOrEditingTrip", () => {
      it("sets the isAddingOrEditingTrip value", () => {
        const store = useUIStateStore();
        store.$patch({ isAddingOrEditingTrip: true });

        store.setIsAddingOrEditingTrip(false);
        expect(store.isAddingOrEditingTrip).toBe(false);

        store.setIsAddingOrEditingTrip(true);
        expect(store.isAddingOrEditingTrip).toBe(true);
      });
    });

    describe("setActiveTripData", () => {
      it("sets active trip data", () => {
        const store = useUIStateStore();
        const data = { trip: TESTING_TRIP, countries: [IRELAND_FOR_TRIP], userIds: [1] };

        store.setActiveTripData(data);

        expect(store.activeTripData).toEqual(data);
      });

      it("clears active trip data when passed null", () => {
        const store = useUIStateStore();
        store.$patch({ activeTripData: { trip: TESTING_TRIP, countries: [], userIds: [] } });

        store.setActiveTripData(null);

        expect(store.activeTripData).toBeNull();
      });
    });

    describe("setIsViewingExpense", () => {
      it("sets the isViewingExpense value", () => {
        const store = useUIStateStore();
        store.$patch({ isViewingExpense: true });

        store.setIsViewingExpense(false);
        expect(store.isViewingExpense).toBe(false);

        store.setIsViewingExpense(true);
        expect(store.isViewingExpense).toBe(true);
      });
    });

    describe("setIsAddingOrEditingExpense", () => {
      it("sets the IsAddingOrEditingExpense value", () => {
        const store = useUIStateStore();
        store.setIsAddingOrEditingExpense(true);
        expect(store.isAddingOrEditingExpense).toBe(true);

        store.setIsAddingOrEditingExpense(false);
        expect(store.isAddingOrEditingExpense).toBe(false);
      });

      it("closes the view panel when opening the edit panel", () => {
        const store = useUIStateStore();
        store.$patch({ isViewingExpense: true });

        store.setIsAddingOrEditingExpense(true);

        expect(store.isViewingExpense).toBe(false);
      });

      it("does not close the view panel when setting to false", () => {
        const store = useUIStateStore();
        store.$patch({ isViewingExpense: true, isAddingOrEditingExpense: true });

        store.setIsAddingOrEditingExpense(false);

        expect(store.isViewingExpense).toBe(true);
      });
    });

    describe("setIsCopyingExpense", () => {
      it("sets the isCopyingExpense value", () => {
        const store = useUIStateStore();
        store.setIsCopyingExpense(true);
        expect(store.isCopyingExpense).toBe(true);

        store.setIsCopyingExpense(false);
        expect(store.isCopyingExpense).toBe(false);
      });

      it("closes the view panel when starting to copy", () => {
        const store = useUIStateStore();
        store.$patch({ isViewingExpense: true });

        store.setIsCopyingExpense(true);

        expect(store.isViewingExpense).toBe(false);
      });

      it("does not close the view panel when setting to false", () => {
        const store = useUIStateStore();
        store.$patch({ isViewingExpense: true, isCopyingExpense: true });

        store.setIsCopyingExpense(false);

        expect(store.isViewingExpense).toBe(true);
      });
    });

    describe("setActiveExpense", () => {
      it("sets the active expense", () => {
        const store = useUIStateStore();
        store.setActiveExpense(EURO_MOCK_EXPENSE_ONE);
        expect(store.activeExpense).toEqual(EURO_MOCK_EXPENSE_ONE);
      });

      it("clears the active expense when passed null", () => {
        const store = useUIStateStore();
        store.$patch({ activeExpense: EURO_MOCK_EXPENSE_ONE });

        store.setActiveExpense(null);

        expect(store.activeExpense).toBeNull();
      });
    });
  });
});
