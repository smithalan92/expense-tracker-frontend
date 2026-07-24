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

  describe("state", () => {
    it("starts with every panel closed", () => {
      const store = useUIStateStore();

      expect(store.isAddingTrip).toBe(false);
      expect(store.tripToEdit).toBeNull();
      expect(store.isAddingExpense).toBe(false);
      expect(store.expenseToView).toBeNull();
      expect(store.expenseToEdit).toBeNull();
      expect(store.expenseToCopy).toBeNull();
    });
  });

  describe("actions", () => {
    describe("setIsAddingTrip", () => {
      it("sets the isAddingTrip value", () => {
        const store = useUIStateStore();

        store.setIsAddingTrip(true);
        expect(store.isAddingTrip).toBe(true);

        store.setIsAddingTrip(false);
        expect(store.isAddingTrip).toBe(false);
      });
    });

    describe("setTripToEdit", () => {
      it("sets the trip to edit", () => {
        const store = useUIStateStore();
        const data = { trip: TESTING_TRIP, countries: [IRELAND_FOR_TRIP], userIds: [1] };

        store.setTripToEdit(data);

        expect(store.tripToEdit).toEqual(data);
      });

      it("clears the trip to edit when passed null", () => {
        const store = useUIStateStore();
        store.$patch({ tripToEdit: { trip: TESTING_TRIP, countries: [], userIds: [] } });

        store.setTripToEdit(null);

        expect(store.tripToEdit).toBeNull();
      });
    });

    describe("setIsAddingExpense", () => {
      it("sets the isAddingExpense value", () => {
        const store = useUIStateStore();

        store.setIsAddingExpense(true);
        expect(store.isAddingExpense).toBe(true);

        store.setIsAddingExpense(false);
        expect(store.isAddingExpense).toBe(false);
      });
    });

    describe("setExpenseToView", () => {
      it("sets the expense to view", () => {
        const store = useUIStateStore();

        store.setExpenseToView(EURO_MOCK_EXPENSE_ONE);

        expect(store.expenseToView).toEqual(EURO_MOCK_EXPENSE_ONE);
      });

      it("clears the expense to view when passed null", () => {
        const store = useUIStateStore();
        store.$patch({ expenseToView: EURO_MOCK_EXPENSE_ONE });

        store.setExpenseToView(null);

        expect(store.expenseToView).toBeNull();
      });
    });

    describe("setExpenseToEdit", () => {
      it("sets the expense to edit", () => {
        const store = useUIStateStore();

        store.setExpenseToEdit(EURO_MOCK_EXPENSE_ONE);

        expect(store.expenseToEdit).toEqual(EURO_MOCK_EXPENSE_ONE);
      });

      it("clears the expense to edit when passed null", () => {
        const store = useUIStateStore();
        store.$patch({ expenseToEdit: EURO_MOCK_EXPENSE_ONE });

        store.setExpenseToEdit(null);

        expect(store.expenseToEdit).toBeNull();
      });

      // Closing the view panel is the caller's job (see ViewExpenseContent.onClickEdit),
      // the store deliberately keeps the two independent.
      it("leaves the expense to view untouched", () => {
        const store = useUIStateStore();
        store.$patch({ expenseToView: EURO_MOCK_EXPENSE_ONE });

        store.setExpenseToEdit(EURO_MOCK_EXPENSE_ONE);

        expect(store.expenseToView).toEqual(EURO_MOCK_EXPENSE_ONE);
      });
    });

    describe("setExpenseToCopy", () => {
      it("sets the expense to copy", () => {
        const store = useUIStateStore();

        store.setExpenseToCopy(EURO_MOCK_EXPENSE_ONE);

        expect(store.expenseToCopy).toEqual(EURO_MOCK_EXPENSE_ONE);
      });

      it("clears the expense to copy when passed null", () => {
        const store = useUIStateStore();
        store.$patch({ expenseToCopy: EURO_MOCK_EXPENSE_ONE });

        store.setExpenseToCopy(null);

        expect(store.expenseToCopy).toBeNull();
      });

      it("leaves the expense to view untouched", () => {
        const store = useUIStateStore();
        store.$patch({ expenseToView: EURO_MOCK_EXPENSE_ONE });

        store.setExpenseToCopy(EURO_MOCK_EXPENSE_ONE);

        expect(store.expenseToView).toEqual(EURO_MOCK_EXPENSE_ONE);
      });
    });
  });
});
