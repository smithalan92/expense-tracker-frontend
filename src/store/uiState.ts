import type { TripExpense } from "@/api/expense";
import { acceptHMRUpdate, defineStore } from "pinia";

const useUIStateStore = defineStore("ui", {
  state: (): UIState => ({
    isAddingTrip: false,
    tripIdToEdit: null,
    isAddingExpense: false,
    expenseToView: null,
    expenseToEdit: null,
    expenseToCopy: null,
  }),
  actions: {
    setIsAddingTrip(value: boolean) {
      this.isAddingTrip = value;
    },
    setTripIdToEdit(data: Nullable<number>) {
      this.tripIdToEdit = data;
    },
    setIsAddingExpense(value: boolean) {
      this.isAddingExpense = value;
    },
    setExpenseToView(value: Nullable<TripExpense>) {
      this.expenseToView = value;
    },
    setExpenseToEdit(value: Nullable<TripExpense>) {
      this.expenseToEdit = value;
    },
    setExpenseToCopy(value: Nullable<TripExpense>) {
      this.expenseToCopy = value;
    },
  },
  persist: false,
});

export default useUIStateStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUIStateStore, import.meta.hot));
}

interface UIState {
  isAddingTrip: boolean;
  tripIdToEdit: Nullable<number>;
  isAddingExpense: boolean;
  expenseToView: Nullable<TripExpense>;
  expenseToEdit: Nullable<TripExpense>;
  expenseToCopy: Nullable<TripExpense>;
}
